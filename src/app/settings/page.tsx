'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Groq API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Groq API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Groq API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{' '}
              <a
                href="https://console.groq.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://console.groq.com/
              </a>
            </p>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
