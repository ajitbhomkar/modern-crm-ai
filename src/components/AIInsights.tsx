'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { aiService, DashboardInsight } from '@/lib/ai-service';
import { useCRMStore } from '@/lib/store';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';

export default function AIInsights() {
  const { customers, tasks } = useCRMStore();
  const [insights, setInsights] = useState<DashboardInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const stats = useCRMStore(state => state.getDashboardStats());

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await aiService.generateDashboardInsights({
        customers,
        tasks,
        revenue: stats.totalRevenue,
      });
      setInsights(data.sort((a, b) => b.priority - a.priority));
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customers.length > 0) {
      loadInsights();
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'alert':
        return <Zap className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      case 'alert':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            AI Intelligence Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights and intelligent recommendations powered by AI
          </p>
        </div>
        <Button onClick={loadInsights} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AI Insights</CardDescription>
            <CardTitle className="text-3xl">{insights.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active recommendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>High Priority</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {insights.filter(i => i.priority >= 8).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Opportunities</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {insights.filter(i => i.type === 'success').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Growth opportunities identified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Warnings</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {insights.filter(i => i.type === 'warning' || i.type === 'alert').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Risk factors detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="risks">Risks & Warnings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 animate-pulse mx-auto mb-4 text-purple-600" />
                <p className="text-muted-foreground">AI is analyzing your data...</p>
              </CardContent>
            </Card>
          ) : insights.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No insights available yet. Add more data to get AI recommendations.</p>
              </CardContent>
            </Card>
          ) : (
            insights.map((insight, index) => (
              <Card key={index} className={`border-2 ${getBgColor(insight.type)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getIcon(insight.type)}
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {insight.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-white dark:bg-gray-800">
                        Priority: {insight.priority}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                {insight.action && (
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <Target className="h-3 w-3 mr-2" />
                      {insight.action}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          {insights
            .filter(i => i.priority >= 8)
            .map((insight, index) => (
              <Card key={index} className={`border-2 ${getBgColor(insight.type)}`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {getIcon(insight.type)}
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {insight.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {insight.action && (
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <Target className="h-3 w-3 mr-2" />
                      {insight.action}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          {insights.filter(i => i.priority >= 8).length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-muted-foreground">No high-priority items at the moment. Great job!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {insights
            .filter(i => i.type === 'success')
            .map((insight, index) => (
              <Card key={index} className={`border-2 ${getBgColor(insight.type)}`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {getIcon(insight.type)}
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {insight.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {insight.action && (
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <Target className="h-3 w-3 mr-2" />
                      {insight.action}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          {insights.filter(i => i.type === 'success').length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Keep working - AI will identify opportunities as they arise.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          {insights
            .filter(i => i.type === 'warning' || i.type === 'alert')
            .map((insight, index) => (
              <Card key={index} className={`border-2 ${getBgColor(insight.type)}`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {getIcon(insight.type)}
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {insight.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {insight.action && (
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <Target className="h-3 w-3 mr-2" />
                      {insight.action}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          {insights.filter(i => i.type === 'warning' || i.type === 'alert').length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-muted-foreground">No risks detected. Everything looks good!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
