import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export interface CustomerInsight {
  customerId: string;
  sentimentScore: number; // -1 to 1
  sentimentLabel: 'positive' | 'neutral' | 'negative';
  churnRisk: number; // 0 to 100
  healthScore: number; // 0 to 100
  nextBestActions: string[];
  keyInsights: string[];
  predictedValue: number;
}

export interface EmailSuggestion {
  subject: string;
  body: string;
  tone: 'professional' | 'friendly' | 'urgent' | 'casual';
  sentiment: string;
  improvements: string[];
}

export interface PredictiveAnalytics {
  revenueForecast: {
    next30Days: number;
    next60Days: number;
    next90Days: number;
    confidence: number;
  };
  dealProbabilities: Array<{
    customerId: string;
    customerName: string;
    probability: number;
    expectedValue: number;
    timeline: string;
  }>;
  trendAnalysis: {
    direction: 'up' | 'down' | 'stable';
    growthRate: number;
    insights: string[];
  };
}

export interface TaskPriority {
  taskId: string;
  priorityScore: number; // 0 to 100
  urgencyReason: string;
  suggestedTime: string;
  estimatedImpact: 'high' | 'medium' | 'low';
}

export interface DashboardInsight {
  type: 'warning' | 'success' | 'info' | 'alert';
  title: string;
  description: string;
  action?: string;
  priority: number;
}

class AIService {
  private isConfigured(): boolean {
    return !!process.env.NEXT_PUBLIC_GROQ_API_KEY;
  }

  private async generateCompletion(prompt: string, systemPrompt: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Groq API key is not configured');
    }

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2000,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI completion error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeCustomer(customer: any): Promise<CustomerInsight> {
    try {
      const prompt = `Analyze this customer data and provide insights:
      
Customer: ${customer.name}
Email: ${customer.email}
Status: ${customer.status}
Revenue: $${customer.value}
Company: ${customer.company || 'N/A'}
Last Contact: ${customer.lastContact || 'Never'}

Provide a JSON response with:
1. sentimentScore (-1 to 1): Based on status, engagement, and revenue
2. sentimentLabel: positive/neutral/negative
3. churnRisk (0-100): Likelihood of losing this customer
4. healthScore (0-100): Overall customer health
5. nextBestActions: Array of 3-4 specific actionable recommendations
6. keyInsights: Array of 2-3 important observations
7. predictedValue: Expected revenue in next 90 days

Return ONLY valid JSON, no markdown or explanation.`;

      const systemPrompt = `You are an expert CRM analyst specializing in customer intelligence, churn prediction, and revenue optimization. Provide data-driven insights based on customer behavior patterns.`;

      const response = await this.generateCompletion(prompt, systemPrompt);
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

      return {
        customerId: customer.id,
        sentimentScore: parsed.sentimentScore || 0,
        sentimentLabel: parsed.sentimentLabel || 'neutral',
        churnRisk: parsed.churnRisk || 0,
        healthScore: parsed.healthScore || 70,
        nextBestActions: parsed.nextBestActions || [],
        keyInsights: parsed.keyInsights || [],
        predictedValue: parsed.predictedValue || customer.value,
      };
    } catch (error) {
      console.error('Customer analysis error:', error);
      // Return fallback data
      return {
        customerId: customer.id,
        sentimentScore: 0,
        sentimentLabel: 'neutral',
        churnRisk: 20,
        healthScore: 75,
        nextBestActions: ['Schedule follow-up call', 'Send personalized email', 'Review account status'],
        keyInsights: ['Active customer', 'Regular engagement'],
        predictedValue: customer.value,
      };
    }
  }

  async generateEmail(context: {
    recipientName: string;
    purpose: string;
    tone: string;
    keyPoints?: string[];
  }): Promise<EmailSuggestion> {
    try {
      const prompt = `Generate a professional email with these details:

Recipient: ${context.recipientName}
Purpose: ${context.purpose}
Desired Tone: ${context.tone}
${context.keyPoints ? `Key Points: ${context.keyPoints.join(', ')}` : ''}

Provide a JSON response with:
1. subject: Compelling email subject line
2. body: Complete email body (3-4 paragraphs)
3. tone: The actual tone used
4. sentiment: Overall sentiment analysis
5. improvements: 2-3 suggestions to enhance the email

Return ONLY valid JSON, no markdown.`;

      const systemPrompt = `You are an expert email copywriter specializing in business communication. Create persuasive, personalized emails that drive engagement and action.`;

      const response = await this.generateCompletion(prompt, systemPrompt);
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

      return {
        subject: parsed.subject || 'Follow-up on our conversation',
        body: parsed.body || '',
        tone: parsed.tone || context.tone as any,
        sentiment: parsed.sentiment || 'professional',
        improvements: parsed.improvements || [],
      };
    } catch (error) {
      console.error('Email generation error:', error);
      return {
        subject: `Follow-up with ${context.recipientName}`,
        body: `Dear ${context.recipientName},\n\nI wanted to follow up regarding ${context.purpose}.\n\nBest regards`,
        tone: 'professional',
        sentiment: 'neutral',
        improvements: ['Add specific details', 'Include call-to-action'],
      };
    }
  }

  async generatePredictiveAnalytics(customers: any[]): Promise<PredictiveAnalytics> {
    try {
      const totalRevenue = customers.reduce((sum, c) => sum + c.value, 0);
      const activeCustomers = customers.filter(c => c.status === 'active').length;

      const prompt = `Analyze this CRM data and provide predictive analytics:

Total Customers: ${customers.length}
Active Customers: ${activeCustomers}
Total Revenue: $${totalRevenue.toLocaleString()}
Average Customer Value: $${(totalRevenue / customers.length).toFixed(2)}

Top Customers:
${customers.slice(0, 5).map(c => `- ${c.name}: $${c.value}`).join('\n')}

Provide JSON with:
1. revenueForecast: {next30Days, next60Days, next90Days, confidence (0-100)}
2. dealProbabilities: Array of top 5 opportunities with {customerId, customerName, probability (0-100), expectedValue, timeline}
3. trendAnalysis: {direction (up/down/stable), growthRate (percentage), insights (array of 3-4 key findings)}

Return ONLY valid JSON.`;

      const systemPrompt = `You are a data scientist specializing in revenue forecasting and predictive analytics for CRM systems. Use statistical patterns and business intelligence.`;

      const response = await this.generateCompletion(prompt, systemPrompt);
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

      return {
        revenueForecast: parsed.revenueForecast || {
          next30Days: totalRevenue * 1.05,
          next60Days: totalRevenue * 1.12,
          next90Days: totalRevenue * 1.20,
          confidence: 75,
        },
        dealProbabilities: parsed.dealProbabilities || [],
        trendAnalysis: parsed.trendAnalysis || {
          direction: 'stable',
          growthRate: 5,
          insights: ['Steady growth pattern', 'Strong customer retention'],
        },
      };
    } catch (error) {
      console.error('Predictive analytics error:', error);
      const totalRevenue = customers.reduce((sum, c) => sum + c.value, 0);
      return {
        revenueForecast: {
          next30Days: totalRevenue * 1.05,
          next60Days: totalRevenue * 1.12,
          next90Days: totalRevenue * 1.20,
          confidence: 70,
        },
        dealProbabilities: customers.slice(0, 5).map(c => ({
          customerId: c.id,
          customerName: c.name,
          probability: 65,
          expectedValue: c.value * 1.2,
          timeline: '30-60 days',
        })),
        trendAnalysis: {
          direction: 'up',
          growthRate: 8,
          insights: ['Positive growth trajectory', 'Strong pipeline'],
        },
      };
    }
  }

  async prioritizeTasks(tasks: any[]): Promise<TaskPriority[]> {
    try {
      const prompt = `Analyze these tasks and prioritize them:

${tasks.map((t, i) => `${i + 1}. ${t.title} (Status: ${t.status}, Priority: ${t.priority})`).join('\n')}

For each task, provide JSON array with:
- taskId: The task ID
- priorityScore: 0-100 (higher = more urgent)
- urgencyReason: Why this priority score
- suggestedTime: Best time to complete
- estimatedImpact: high/medium/low

Return ONLY valid JSON array.`;

      const systemPrompt = `You are a productivity expert specializing in task prioritization and time management. Consider urgency, importance, and business impact.`;

      const response = await this.generateCompletion(prompt, systemPrompt);
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Task prioritization error:', error);
      return tasks.map(t => ({
        taskId: t.id,
        priorityScore: t.priority === 'high' ? 90 : t.priority === 'medium' ? 60 : 30,
        urgencyReason: 'Standard priority',
        suggestedTime: 'This week',
        estimatedImpact: t.priority as any,
      }));
    }
  }

  async generateDashboardInsights(data: {
    customers: any[];
    tasks: any[];
    revenue: number;
  }): Promise<DashboardInsight[]> {
    try {
      const prompt = `Analyze this CRM dashboard data and provide actionable insights:

Total Customers: ${data.customers.length}
Active: ${data.customers.filter(c => c.status === 'active').length}
Leads: ${data.customers.filter(c => c.status === 'lead').length}
Total Revenue: $${data.revenue.toLocaleString()}
Pending Tasks: ${data.tasks.filter(t => t.status === 'pending').length}

Generate 5-7 insights as JSON array with:
- type: warning/success/info/alert
- title: Short headline
- description: Detailed insight
- action: Suggested action (optional)
- priority: 1-10 (higher = more important)

Focus on: opportunities, risks, trends, and actionable recommendations.

Return ONLY valid JSON array.`;

      const systemPrompt = `You are a business intelligence analyst specializing in CRM insights. Identify patterns, anomalies, and opportunities that drive business growth.`;

      const response = await this.generateCompletion(prompt, systemPrompt);
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Dashboard insights error:', error);
      return [
        {
          type: 'info',
          title: 'Customer Base Growing',
          description: `You have ${data.customers.length} customers with steady growth`,
          priority: 5,
        },
        {
          type: 'warning',
          title: 'Pending Tasks',
          description: `${data.tasks.filter(t => t.status === 'pending').length} tasks need attention`,
          action: 'Review task list',
          priority: 7,
        },
      ];
    }
  }

  async analyzeMeetingNotes(notes: string): Promise<{
    summary: string;
    actionItems: string[];
    keyDecisions: string[];
    followUps: string[];
  }> {
    try {
      const prompt = `Analyze these meeting notes and extract key information:

${notes}

Provide JSON with:
- summary: 2-3 sentence overview
- actionItems: Array of specific action items
- keyDecisions: Array of important decisions made
- followUps: Array of follow-up items needed

Return ONLY valid JSON.`;

      const systemPrompt = `You are an executive assistant specializing in meeting analysis and action item extraction.`;

      const response = await this.generateCompletion(prompt, systemPrompt);
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

      return {
        summary: parsed.summary || '',
        actionItems: parsed.actionItems || [],
        keyDecisions: parsed.keyDecisions || [],
        followUps: parsed.followUps || [],
      };
    } catch (error) {
      console.error('Meeting analysis error:', error);
      return {
        summary: 'Meeting notes analyzed',
        actionItems: [],
        keyDecisions: [],
        followUps: [],
      };
    }
  }
}

export const aiService = new AIService();
