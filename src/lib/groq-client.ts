import Groq from "groq-sdk";

// Initialize Groq client only if API key is available
let groq: Groq | null = null;

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });
}

export async function generateLeadScore(leadData: {
  name: string;
  email: string;
  company?: string;
  industry?: string;
  interactions: number;
}): Promise<number> {
  // Return mock score if Groq is not configured
  if (!groq) {
    console.warn("Groq API not configured. Using mock lead score.");
    const baseScore = 50;
    const interactionBonus = Math.min(leadData.interactions * 2, 30);
    const hasCompany = leadData.company ? 10 : 0;
    const hasIndustry = leadData.industry ? 10 : 0;
    return Math.min(100, baseScore + interactionBonus + hasCompany + hasIndustry);
  }

  try {
    const prompt = `You are an expert CRM analyst. Based on the following lead data, provide a lead score from 0-100:
    
Name: ${leadData.name}
Email: ${leadData.email}
Company: ${leadData.company || 'N/A'}
Industry: ${leadData.industry || 'N/A'}
Interactions: ${leadData.interactions}

Respond with ONLY a number between 0-100.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 10,
    });

    const score = parseInt(completion.choices[0]?.message?.content || "50");
    return Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error("Error generating lead score:", error);
    return 50; // Default score
  }
}

export async function chatWithAI(message: string, context?: string): Promise<string> {
  // Return helpful message if Groq is not configured
  if (!groq) {
    return "I'm currently not configured with an API key. Please add your Groq API key in the Settings page to enable AI features.";
  }

  try {
    const systemMessage = `You are a helpful CRM assistant. You help users manage their customer relationships, analyze data, and provide insights. ${context ? `Context: ${context}` : ''}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error("Error chatting with AI:", error);
    return "I'm having trouble connecting right now. Please make sure your API key is configured correctly in Settings.";
  }
}

export { groq };
