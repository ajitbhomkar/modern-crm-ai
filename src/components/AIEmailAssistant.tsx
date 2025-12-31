'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { aiService, EmailSuggestion } from '@/lib/ai-service';
import { useCRMStore } from '@/lib/store';
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Send, 
  Lightbulb,
  CheckCircle,
  Smile,
  Briefcase,
  Zap,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AIEmailAssistant() {
  const { customers } = useCRMStore();
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tone, setTone] = useState('professional');
  const [keyPoints, setKeyPoints] = useState('');
  const [generating, setGenerating] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<EmailSuggestion | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!recipient || !purpose) {
      toast({
        title: 'Missing Information',
        description: 'Please provide recipient name and email purpose',
        variant: 'destructive',
      });
      return;
    }

    setGenerating(true);
    try {
      const suggestion = await aiService.generateEmail({
        recipientName: recipient,
        purpose,
        tone,
        keyPoints: keyPoints ? keyPoints.split(',').map(p => p.trim()) : undefined,
      });

      setEmailSuggestion(suggestion);
      toast({
        title: 'Email Generated',
        description: 'Your AI-powered email is ready!',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Could not generate email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Text copied to clipboard',
    });
  };

  const getToneIcon = (toneType: string) => {
    switch (toneType) {
      case 'professional':
        return <Briefcase className="h-4 w-4" />;
      case 'friendly':
        return <Smile className="h-4 w-4" />;
      case 'urgent':
        return <Zap className="h-4 w-4" />;
      case 'casual':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Mail className="h-8 w-8 text-purple-600" />
            AI Email Assistant
          </h1>
          <p className="text-muted-foreground">Generate personalized emails with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Compose Email</CardTitle>
            <CardDescription>Tell AI what kind of email you need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Name</Label>
              <Input
                id="recipient"
                placeholder="e.g., John Smith"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              {customers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="text-xs text-muted-foreground w-full">Quick select:</p>
                  {customers.slice(0, 5).map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => setRecipient(customer.name)}
                      className="text-xs bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded hover:bg-purple-100 dark:hover:bg-purple-950/40"
                    >
                      {customer.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Email Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g., Follow up on our meeting, Introduce new product"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPoints">Key Points (optional)</Label>
              <Input
                id="keyPoints"
                placeholder="e.g., pricing discussion, demo availability, next steps"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate multiple points with commas</p>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="grid grid-cols-2 gap-2">
                {['professional', 'friendly', 'urgent', 'casual'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      tone === t
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {getToneIcon(t)}
                    <span className="text-sm capitalize">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Email</CardTitle>
            <CardDescription>
              {emailSuggestion ? 'Your AI-crafted email is ready' : 'Generated content will appear here'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSuggestion ? (
              <div className="py-12 text-center">
                <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Fill in the details and click "Generate Email" to create your message
                </p>
              </div>
            ) : (
              <Tabs defaultValue="email" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Subject</p>
                        <p className="font-medium">{emailSuggestion.subject}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(emailSuggestion.subject)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-muted-foreground">Email Body</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(emailSuggestion.body)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-sm whitespace-pre-wrap">{emailSuggestion.body}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() =>
                          handleCopy(
                            `Subject: ${emailSuggestion.subject}\n\n${emailSuggestion.body}`
                          )
                        }
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Full Email
                      </Button>
                      <Button variant="outline">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-4">
                  <Card className="border-2 border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getToneIcon(emailSuggestion.tone)}
                        Email Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Tone</p>
                        <p className="text-sm text-muted-foreground capitalize">{emailSuggestion.tone}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Sentiment</p>
                        <p className="text-sm text-muted-foreground capitalize">{emailSuggestion.sentiment}</p>
                      </div>

                      {emailSuggestion.improvements.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                            Suggestions for Improvement
                          </p>
                          <ul className="space-y-2">
                            {emailSuggestion.improvements.map((improvement, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Templates</CardTitle>
          <CardDescription>Pre-filled scenarios to get started quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => {
                setPurpose('Follow up on our recent meeting');
                setTone('professional');
                setKeyPoints('action items, next steps, timeline');
              }}
              className="p-4 text-left border rounded-lg hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all"
            >
              <p className="font-medium text-sm mb-1">Meeting Follow-up</p>
              <p className="text-xs text-muted-foreground">Professional tone with action items</p>
            </button>

            <button
              onClick={() => {
                setPurpose('Introduce our new product features');
                setTone('friendly');
                setKeyPoints('benefits, demo availability, special offer');
              }}
              className="p-4 text-left border rounded-lg hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all"
            >
              <p className="font-medium text-sm mb-1">Product Introduction</p>
              <p className="text-xs text-muted-foreground">Friendly tone with benefits focus</p>
            </button>

            <button
              onClick={() => {
                setPurpose('Request urgent response on pending proposal');
                setTone('urgent');
                setKeyPoints('deadline, importance, consequences');
              }}
              className="p-4 text-left border rounded-lg hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all"
            >
              <p className="font-medium text-sm mb-1">Urgent Request</p>
              <p className="text-xs text-muted-foreground">Urgent tone with clear deadline</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
