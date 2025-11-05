// IMPORTANT: This file should be placed in the `api` directory at the root of your project.
// Vercel will automatically detect this as a serverless function.
// e.g., /api/generate-summary.ts

import { GoogleGenAI, Type } from "@google/genai";
import type { UserData } from '../types';

const API_KEY = process.env.API_KEY;

// Helper to create a JSON error response
const createErrorResponse = (body: any, status: number = 500) => {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return createErrorResponse({ error: 'Method not allowed' }, 405);
  }

  if (!API_KEY) {
    console.error("Gemini API key not found on server.");
    return createErrorResponse({ error: "Server configuration error: API key is missing." }, 500);
  }
  
  // FIX: Declare part outside the try block to make it accessible in the catch block for better error logging.
  let part: string | undefined;

  try {
    const body = await request.json() as { userData: UserData; language: 'en' | 'ar', part: string };
    const { userData, language } = body;
    part = body.part;
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const targetLanguage = language === 'ar' ? 'Arabic' : 'English';
    
    // FIX: Inlined the getPromptAndSchemaForPart logic to resolve scoping and type inference errors.
    const baseIntro = `Act as a world-class digital marketing strategist. Your response MUST be in ${targetLanguage}. Return ONLY the requested JSON object.`;
    const userDataText = `Based on this User Data:\n- Industry: ${userData.industry} (${userData.subIndustry})\n- Company Size: ${userData.companySize}\n- Goals: ${userData.goals.join(', ')}\n- Challenges: ${userData.challenges.join(', ')}\n- Platforms: ${userData.platforms.join(', ')}`;
    
    const prompts: Record<string, string> = {
        executiveSummary: `${baseIntro}\n${userDataText}\n\nGenerate a brief, high-level executive summary (3-4 sentences).`,
        goalRecommendations: `${baseIntro}\n${userDataText}\n\nFor EACH of the user's goals, provide 3 actionable recommendations.`,
        swotAnalysis: `${baseIntro}\n${userDataText}\n\nGenerate a SWOT analysis with 2-3 points for each category.`,
        customerPersona: `${baseIntro}\n${userDataText}\n\nGenerate a detailed customer persona.`,
        timeline: `${baseIntro}\n${userDataText}\n\nGenerate a 12-month roadmap with 4 quarters, each having 2-3 key actions.`,
        kpiProjections: `${baseIntro}\n${userDataText}\n\nProject the most relevant KPI for the next 6 months, showing a realistic upward trend.`,
        budgetAllocation: `${baseIntro}\n${userDataText}\n\nProvide a budget allocation for 3-5 marketing channels. Percentages must sum to 100.`,
        gamification: `${baseIntro}\n${userDataText}\n\nProvide a cool, encouraging gamification title and a single representative emoji for the user.`,
    };

    const schemas: Record<string, any> = {
        executiveSummary: { type: Type.OBJECT, properties: { executiveSummary: { type: Type.STRING, description: 'The executive summary text.' } } },
        goalRecommendations: { type: Type.OBJECT, properties: { goalRecommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { goal: { type: Type.STRING }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } } } } } } },
        swotAnalysis: { type: Type.OBJECT, properties: { swotAnalysis: { type: Type.OBJECT, properties: { strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }, threats: { type: Type.ARRAY, items: { type: Type.STRING } } } } } },
        customerPersona: { type: Type.OBJECT, properties: { customerPersona: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, demographics: { type: Type.STRING }, goals: { type: Type.ARRAY, items: { type: Type.STRING } }, painPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } } } },
        timeline: { type: Type.OBJECT, properties: { timeline: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { quarter: { type: Type.STRING }, focus: { type: Type.STRING }, keyActions: { type: Type.ARRAY, items: { type: Type.STRING } } } } } } },
        kpiProjections: { type: Type.OBJECT, properties: { kpiProjections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, data: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { month: { type: Type.STRING }, value: { type: Type.NUMBER } } } } } } } } } },
        budgetAllocation: { type: Type.OBJECT, properties: { budgetAllocation: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { channel: { type: Type.STRING }, percentage: { type: Type.NUMBER } } } } } },
        gamification: { type: Type.OBJECT, properties: { gamification: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, badgeIcon: { type: Type.STRING } } } } },
    };

    const prompt = part ? prompts[part] : undefined;
    const schema = part ? schemas[part] : undefined;

    if (!prompt || !schema) {
        throw new Error(`Invalid part requested: ${part}`);
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
        },
    });

    return new Response(response.text, {
        headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    // FIX: Updated error logging to be more descriptive by including which part failed.
    console.error(`Error in handler for part '${part}':`, error);
    return createErrorResponse({ error: `Failed to generate plan part '${part}'. ${error.message}` }, 500);
  }
}
