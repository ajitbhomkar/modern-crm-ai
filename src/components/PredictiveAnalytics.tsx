'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { aiService, PredictiveAnalytics } from '@/lib/ai-service';
import { useCRMStore } from '@/lib/store';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  RefreshCw,
  AlertCircle,
  Activity,
  BarChart3
} from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

export default function PredictiveAnalyticsDashboard() {
  const { customers } = useCRMStore();
  const [analytics, setAnalytics] = useState<PredictiveAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    if (customers.length === 0) return;

    setLoading(true);
    try {
      const data = await aiService.generatePredictiveAnalytics(customers);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customers.length > 0) {
      loadAnalytics();
    }
  }, [customers.length]);

  const getForecastData = () => {
    if (!analytics) return [];
    return [
      { name: 'Current', value: customers.reduce((sum, c) => sum + c.value, 0) },
      { name: '30 Days', value: analytics.revenueForecast.next30Days },
      { name: '60 Days', value: analytics.revenueForecast.next60Days },
      { name: '90 Days', value: analytics.revenueForecast.next90Days },
    ];
  };

  const getDealProbabilityData = () => {
    if (!analytics) return [];
    return analytics.dealProbabilities.map(deal => ({
      name: deal.customerName.split(' ')[0],
      probability: deal.probability,
      value: deal.expectedValue,
    }));
  };

  const getTrendIcon = () => {
    if (!analytics) return <Activity className="h-5 w-5" />;
    return analytics.trendAnalysis.direction === 'up' ? (
      <TrendingUp className="h-5 w-5 text-green-600" />
    ) : analytics.trendAnalysis.direction === 'down' ? (
      <TrendingDown className="h-5 w-5 text-red-600" />
    ) : (
      <Activity className="h-5 w-5 text-yellow-600" />
    );
  };

  const getTrendColor = () => {
    if (!analytics) return 'text-gray-600';
    return analytics.trendAnalysis.direction === 'up'
      ? 'text-green-600'
      : analytics.trendAnalysis.direction === 'down'
      ? 'text-red-600'
      : 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            Predictive Analytics
          </h1>
          <p className="text-muted-foreground">AI-powered revenue forecasting and trend analysis</p>
        </div>
        <Button onClick={loadAnalytics} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Analytics
        </Button>
      </div>

      {loading && !analytics ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Zap className="h-12 w-12 animate-pulse mx-auto mb-4 text-purple-600" />
            <p className="text-muted-foreground">Crunching numbers with AI...</p>
          </CardContent>
        </Card>
      ) : !analytics ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Add customers to generate predictive analytics</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>30-Day Forecast</CardDescription>
                <CardTitle className="text-2xl">
                  ${analytics.revenueForecast.next30Days.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {((analytics.revenueForecast.next30Days / customers.reduce((sum, c) => sum + c.value, 0) - 1) * 100).toFixed(1)}% growth
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>90-Day Projection</CardDescription>
                <CardTitle className="text-2xl">
                  ${analytics.revenueForecast.next90Days.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {((analytics.revenueForecast.next90Days / customers.reduce((sum, c) => sum + c.value, 0) - 1) * 100).toFixed(1)}% growth
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Confidence Score</CardDescription>
                <CardTitle className="text-2xl">{analytics.revenueForecast.confidence}%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  High accuracy prediction
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Growth Trend</CardDescription>
                <CardTitle className={`text-2xl flex items-center gap-2 ${getTrendColor()}`}>
                  {getTrendIcon()}
                  {analytics.trendAnalysis.growthRate.toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground capitalize">
                  {analytics.trendAnalysis.direction} trajectory
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="forecast" className="space-y-4">
            <TabsList>
              <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
              <TabsTrigger value="deals">Deal Probability</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="forecast" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast Projection</CardTitle>
                  <CardDescription>Predicted revenue growth over the next 90 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={getForecastData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        name="Revenue"
                        dot={{ fill: '#8b5cf6', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { period: '30 Days', value: analytics.revenueForecast.next30Days, icon: <Zap className="h-4 w-4" /> },
                      { period: '60 Days', value: analytics.revenueForecast.next60Days, icon: <Target className="h-4 w-4" /> },
                      { period: '90 Days', value: analytics.revenueForecast.next90Days, icon: <TrendingUp className="h-4 w-4" /> },
                    ].map((item) => (
                      <div key={item.period} className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          {item.icon}
                          {item.period}
                        </div>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                          ${item.value.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Probability Analysis</CardTitle>
                  <CardDescription>Top opportunities ranked by AI-predicted success rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={getDealProbabilityData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="probability" fill="#8b5cf6" name="Win Probability (%)" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-6 space-y-3">
                    {analytics.dealProbabilities.map((deal, index) => (
                      <div
                        key={deal.customerId}
                        className="p-4 border rounded-lg hover:border-purple-600 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                              <div>
                                <p className="font-semibold">{deal.customerName}</p>
                                <p className="text-sm text-muted-foreground">{deal.timeline}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Win Probability</p>
                            <p className="text-2xl font-bold text-green-600">{deal.probability}%</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Expected Value</span>
                          <span className="text-lg font-semibold text-green-600">
                            ${deal.expectedValue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Trend Analysis</CardTitle>
                  <CardDescription>Key insights from predictive analytics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    {getTrendIcon()}
                    <div>
                      <p className="font-semibold mb-1">Overall Trend Direction</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Your revenue is trending <strong>{analytics.trendAnalysis.direction}</strong> with a growth rate of{' '}
                        <strong className={getTrendColor()}>{analytics.trendAnalysis.growthRate.toFixed(1)}%</strong>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Key Findings
                    </h3>
                    <div className="space-y-3">
                      {analytics.trendAnalysis.insights.map((insight, index) => (
                        <div
                          key={index}
                          className="p-3 border-l-4 border-purple-600 bg-gray-50 dark:bg-gray-900 rounded-r-lg"
                        >
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Forecast Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-600 rounded-full"
                            style={{ width: `${analytics.revenueForecast.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{analytics.revenueForecast.confidence}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {analytics.revenueForecast.confidence >= 80
                          ? 'High confidence - reliable predictions'
                          : analytics.revenueForecast.confidence >= 60
                          ? 'Moderate confidence - monitor closely'
                          : 'Low confidence - more data needed'}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Total Pipeline Value</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${analytics.dealProbabilities
                          .reduce((sum, deal) => sum + deal.expectedValue, 0)
                          .toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Across {analytics.dealProbabilities.length} opportunities
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
