'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCRMStore } from '@/lib/store';
import { aiService, CustomerInsight } from '@/lib/ai-service';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Building2, 
  Sparkles, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Heart,
  DollarSign,
  Activity,
  Target,
  Brain
} from 'lucide-react';

export default function Customers() {
  const { customers, addCustomer } = useCRMStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [customerInsights, setCustomerInsights] = useState<Map<string, CustomerInsight>>(new Map());
  const [analyzingCustomer, setAnalyzingCustomer] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-analyze customers on load
  useEffect(() => {
    const analyzeTopCustomers = async () => {
      const topCustomers = customers
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      for (const customer of topCustomers) {
        if (!customerInsights.has(customer.id)) {
          try {
            const insight = await aiService.analyzeCustomer(customer);
            setCustomerInsights(prev => new Map(prev).set(customer.id, insight));
          } catch (error) {
            console.error('Failed to analyze customer:', error);
          }
        }
      }
    };

    if (customers.length > 0 && customerInsights.size === 0) {
      analyzeTopCustomers();
    }
  }, [customers]);

  const handleAnalyzeCustomer = async (customerId: string) => {
    setAnalyzingCustomer(customerId);
    try {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) return;

      const insight = await aiService.analyzeCustomer(customer);
      setCustomerInsights(prev => new Map(prev).set(customerId, insight));

      toast({
        title: 'AI Analysis Complete',
        description: `Generated insights for ${customer.name}`,
      });
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Could not generate AI insights. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAnalyzingCustomer(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'lead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getChurnColor = (risk: number) => {
    if (risk >= 70) return 'text-red-600';
    if (risk >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-yellow-600" />;
    }
  };

  // Calculate category stats
  const highValueCustomers = customers.filter(c => c.value > 50000);
  const atRiskCustomers = Array.from(customerInsights.values()).filter(i => i.churnRisk > 60);
  const healthyCustomers = Array.from(customerInsights.values()).filter(i => i.healthScore >= 80);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Customer Intelligence
          </h1>
          <p className="text-muted-foreground">Advanced insights and predictive analytics</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>High Value</CardDescription>
            <CardTitle className="text-2xl">{highValueCustomers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Over $50k revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>At Risk</CardDescription>
            <CardTitle className="text-2xl text-red-600">{atRiskCustomers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              High churn risk detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Healthy</CardDescription>
            <CardTitle className="text-2xl text-green-600">{healthyCustomers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Strong relationship
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Analyzed</CardDescription>
            <CardTitle className="text-2xl">{customerInsights.size}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI insights generated
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="high-value">High Value</TabsTrigger>
          <TabsTrigger value="at-risk">At Risk</TabsTrigger>
          <TabsTrigger value="healthy">Healthy</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredCustomers.map((customer) => {
              const insight = customerInsights.get(customer.id);
              return (
                <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>{customer.name}</CardTitle>
                          {insight && getSentimentIcon(insight.sentimentLabel)}
                        </div>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </CardDescription>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        {customer.company && (
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Building2 className="h-4 w-4 mr-2" />
                            {customer.company}
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            {customer.phone}
                          </div>
                        )}
                        <div className="flex items-center text-sm mt-2">
                          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                          <span className="font-semibold">${customer.value.toLocaleString()}</span>
                        </div>
                      </div>

                      {insight && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Health Score</span>
                              <span className={`font-bold ${getHealthColor(insight.healthScore)}`}>
                                {insight.healthScore}/100
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Churn Risk</span>
                              <span className={`font-bold ${getChurnColor(insight.churnRisk)}`}>
                                {insight.churnRisk}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Predicted Value</span>
                              <span className="font-bold text-green-600">
                                ${insight.predictedValue.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">Key Insights:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {insight.keyInsights.slice(0, 2).map((item, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-purple-600">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>

                    {insight && insight.nextBestActions.length > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-purple-600" />
                          Recommended Actions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {insight.nextBestActions.slice(0, 3).map((action, i) => (
                            <span key={i} className="text-xs bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleAnalyzeCustomer(customer.id)}
                      disabled={analyzingCustomer === customer.id}
                    >
                      {analyzingCustomer === customer.id ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : insight ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Refresh Analysis
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Generate AI Insights
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="high-value" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredCustomers
              .filter(c => c.value > 50000)
              .map((customer) => {
                const insight = customerInsights.get(customer.id);
                return (
                  <Card key={customer.id} className="border-2 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        {customer.name}
                      </CardTitle>
                      <CardDescription>${customer.value.toLocaleString()} revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {insight && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Health Score:</span>
                            <span className={getHealthColor(insight.healthScore)}>{insight.healthScore}/100</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Predicted 90d Value:</span>
                            <span className="font-bold">${insight.predictedValue.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="at-risk" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredCustomers
              .filter(c => {
                const insight = customerInsights.get(c.id);
                return insight && insight.churnRisk > 60;
              })
              .map((customer) => {
                const insight = customerInsights.get(customer.id)!;
                return (
                  <Card key={customer.id} className="border-2 border-red-200 dark:border-red-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        {customer.name}
                      </CardTitle>
                      <CardDescription>High churn risk: {insight.churnRisk}%</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Urgent Actions:</p>
                        <ul className="space-y-1">
                          {insight.nextBestActions.map((action, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Target className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="healthy" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredCustomers
              .filter(c => {
                const insight = customerInsights.get(c.id);
                return insight && insight.healthScore >= 80;
              })
              .map((customer) => {
                const insight = customerInsights.get(customer.id)!;
                return (
                  <Card key={customer.id} className="border-2 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-green-600" />
                        {customer.name}
                      </CardTitle>
                      <CardDescription>Health Score: {insight.healthScore}/100</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Strong relationship with low churn risk ({insight.churnRisk}%)
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          Potential for upsell: ${(insight.predictedValue - customer.value).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No customers found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search' : 'Add your first customer to get started'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
