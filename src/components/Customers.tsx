'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCRMStore, type Customer } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Plus, Mail, Phone, Building2, TrendingUp } from 'lucide-react';
import { generateLeadScore } from '@/lib/groq-client';

export default function Customers() {
  const { customers, updateCustomer } = useCRMStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isGeneratingScore, setIsGeneratingScore] = useState(false);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateScore = async (customer: Customer) => {
    setIsGeneratingScore(true);
    try {
      const score = await generateLeadScore({
        name: customer.name,
        email: customer.email,
        company: customer.company,
        industry: customer.industry,
        interactions: customer.interactions,
      });
      updateCustomer(customer.id, { leadScore: score });
    } catch (error) {
      console.error('Error generating lead score:', error);
    } finally {
      setIsGeneratingScore(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'lead':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search customers by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedCustomer(customer)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{customer.company}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    customer.status
                  )}`}
                >
                  {customer.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>{customer.industry || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Value</span>
                  <span className="text-sm font-bold">{formatCurrency(customer.value)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lead Score</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getScoreColor(customer.leadScore)}`}>
                      {customer.leadScore || 'N/A'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateScore(customer);
                      }}
                      disabled={isGeneratingScore}
                    >
                      <TrendingUp className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last Contact</span>
                  <span>{formatDate(customer.lastContact)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No customers found</p>
        </div>
      )}
    </div>
  );
}
