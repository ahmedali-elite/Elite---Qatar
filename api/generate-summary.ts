// IMPORTANT: This file should be placed in the `api` directory at the root of your project.
// Vercel will automatically detect this as a serverless function.
// e.g., /api/generate-summary.ts

import { GoogleGenAI, Type } from "@google/genai";
import type { UserData, SummaryData } from '../types';

// The API key is securely accessed from Vercel's environment variables
const API_KEY = process.env.API_KEY;

// Helper function to create the Response object, required by Vercel
const createResponse = (body: any, status: number = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getDefaultSummary = (): SummaryData => ({
    executiveSummary: "Our AI is currently unavailable to generate the full summary. Apologies! Based on your inputs, the clear next step is to build an action plan. We recommend focusing on 'quick wins' that address your most pressing challenges first to build momentum toward achieving your long-term goals.",
    timeline: [
        { quarter: 'Q1', focus: 'Foundation & Planning', milestones: ['Finalize strategy', 'Set KPIs', 'Initial market research'] },
        { quarter: 'Q2', focus: 'Execution & Launch', milestones: ['Launch MVP/Campaign', 'Gather user feedback', 'Iterate on offerings'] },
        { quarter: 'Q3', focus: 'Growth & Optimization', milestones: ['Scale marketing efforts', 'Optimize conversion funnels', 'Analyze performance data'] },
        { quarter: 'Q4', focus: 'Scaling & Future-Proofing', milestones: ['Expand to new markets', 'Develop next-gen features', 'Plan for the upcoming year'] },
    ],
    kpiProjections: [
        { name: 'Metric A', current: 0, projected: 25 },
        { name: 'Metric B', current: 0, projected: 40 },
    ],
    focusAreas: [
        { area: 'Content', score: 70 }, { area: 'SEO', score: 85 }, { area: 'Ads', score: 60 }, { area: 'Social', score: 90 }, { area: 'Email', score: 75 },
    ],
    budgetAllocation: [
        { name: 'Paid Ads', value: 40, color: '#a9ce17' }, { name: 'Content Creation', value: 30, color: '#c5e053' }, { name: 'SEO', value: 20, color: '#ddec8f' }, { name: 'Tools', value: 10, color: '#f3f8d3' },
    ],
    swotAnalysis: {
        strengths: ['Innovative product', 'Strong team'], weaknesses: ['Limited brand recognition', 'Small marketing budget'],
        opportunities: ['Emerging markets', 'New technology adoption'], threats: ['Intense competition', 'Changing regulations'],
    },
    customerPersona: {
        name: 'Tech-Savvy Tina',
        demographics: '28-40, Urban, Marketing Manager',
        goals: ['Increase team efficiency', 'Show ROI on marketing spend'],
        painPoints: ['Complex software', 'Lack of time for training'],
    },
    challengesAnalysis: {
        summary: 'Your primary challenges seem to be budget constraints and strong competition. The recommended strategies focus on cost-effective, high-impact channels like SEO and content marketing to build a sustainable advantage.',
        chartData: [
            { name: 'Budget', impact: 80 }, { name: 'Competition', impact: 90 }, { name: 'Tech', impact: 60 }, { name: 'Talent', impact: 75 },
        ]
    },
    goalRecommendations: [
        {
            goal: 'Increase Brand Awareness',
            recommendations: ['Launch a targeted social media campaign.', 'Collaborate with industry influencers.', 'Invest in content marketing and SEO.']
        }
    ],
    gamification: {
        title: 'Digital Pioneer',
        badgeIcon: '🚀'
    }
});


const getResponseSchema = () => {
    // This schema is for structural guidance for the AI. Descriptions are for the AI's benefit.
    return {
        type: Type.OBJECT,
        properties: {
            executiveSummary: { type: Type.STRING, description: "A brief, high-level overview of the entire strategic plan." },
            timeline: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        quarter: { type: Type.STRING, description: "The quarter, e.g., 'Q1 2024'." },
                        focus: { type: Type.STRING, description: "The main theme or focus for that quarter." },
                        milestones: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 key, actionable milestones for the quarter." },
                    },
                    required: ['quarter', 'focus', 'milestones'],
                },
            },
            kpiProjections: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "Name of the Key Performance Indicator." },
                        current: { type: Type.NUMBER, description: "The current value of the KPI." },
                        projected: { type: Type.NUMBER, description: "The projected value after 12 months." },
                    },
                    required: ['name', 'current', 'projected'],
                },
            },
            focusAreas: {
                type: Type.ARRAY, description: "5 key areas of focus for the strategy.",
                items: {
                    type: Type.OBJECT, properties: {
                        area: { type: Type.STRING, description: "e.g., 'Content Marketing', 'SEO', 'Paid Ads'." },
                        score: { type: Type.NUMBER, description: "A score from 0-100 indicating strategic importance." },
                    }, required: ['area', 'score']
                }
            },
            budgetAllocation: {
                type: Type.ARRAY, description: "4-5 categories for budget allocation.",
                items: {
                    type: Type.OBJECT, properties: {
                        name: { type: Type.STRING, description: "Category name, e.g., 'Paid Ads'." },
                        value: { type: Type.NUMBER, description: "Percentage of the budget." },
                        color: { type: Type.STRING, description: "A hex color code for the chart." },
                    }, required: ['name', 'value', 'color']
                }
            },
            swotAnalysis: {
                type: Type.OBJECT,
                properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
            },
            customerPersona: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "A catchy name for the persona." },
                    demographics: { type: Type.STRING, description: "Age, location, job title, etc." },
                    goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                    painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['name', 'demographics', 'goals', 'painPoints'],
            },
            challengesAnalysis: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING, description: "A summary of how the strategy addresses the user's selected challenges." },
                    chartData: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Name of the challenge." },
                                impact: { type: Type.NUMBER, description: "A 0-100 score of how much this challenge impacts their goals." },
                            },
                            required: ['name', 'impact']
                        }
                    }
                },
                required: ['summary', 'chartData']
            },
            goalRecommendations: {
                type: Type.ARRAY,
                description: "Provide specific recommendations for EACH of the user's selected goals.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        goal: { type: Type.STRING, description: "The specific user goal this recommendation addresses." },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 actionable recommendations for this goal." }
                    },
                    required: ['goal', 'recommendations']
                }
            },
            gamification: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "An encouraging, cool title for the user based on their inputs, e.g., 'Digital Visionary', 'Growth Hacker'." },
                    badgeIcon: { type: Type.STRING, description: "A single emoji that represents the user's title." },
                },
                required: ['title', 'badgeIcon']
            },
        },
        required: ['executiveSummary', 'timeline', 'kpiProjections', 'focusAreas', 'budgetAllocation', 'swotAnalysis', 'customerPersona', 'challengesAnalysis', 'goalRecommendations', 'gamification'],
    };
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return createResponse({ error: 'Method not allowed' }, 405);
  }

  if (!API_KEY) {
    console.error("Gemini API key not found on server.");
    return createResponse({ error: "Server configuration error: API key is missing." }, 500);
  }

  try {
    const { userData, language } = (await request.json()) as { userData: UserData; language: 'en' | 'ar' };

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // --- STEP 1: Always generate the plan in English for quality and consistency ---
    let englishPlanJsonString: string;
    try {
        const englishPrompt = `
            Act as a world-class digital marketing strategist. Based on the following user data, generate a comprehensive, insightful, and actionable digital marketing strategy.

            **User Data:**
            - Industry: ${userData.industry} (${userData.subIndustry})
            - Company Size: ${userData.companySize}
            - Goals: ${userData.goals.join(', ')}
            - Challenges: ${userData.challenges.join(', ')}
            - Platforms: ${userData.platforms.join(', ')}

            **Instructions:**
            1. Generate a response in valid JSON format that strictly adheres to the provided schema.
            2. All content must be in professional English.
            3. Be creative, specific, and provide high-value, actionable recommendations.
            4. The "gamification.title" should be a cool, encouraging title for the user, like "Growth Hacker" or "Digital Visionary".
            5. Ensure the executive summary is concise yet comprehensive.
        `;

        const englishResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: englishPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: getResponseSchema(),
            },
        });

        englishPlanJsonString = englishResponse.text;
    } catch (error) {
        console.error("Error generating English strategic plan:", error);
        return createResponse(getDefaultSummary()); // Fallback on failure
    }

    // --- STEP 2: If language is Arabic, translate the English plan ---
    if (language === 'ar') {
        try {
            const translationPrompt = `
                **Task:** Translate the text values within the following JSON object from English to professional Arabic.

                **Rules:**
                1.  **DO NOT** translate the JSON keys (e.g., "executiveSummary", "quarter", "recipeName").
                2.  **ONLY** translate the string values associated with the keys.
                3.  Maintain the exact original JSON structure, including arrays, nested objects, and data types (numbers, booleans).
                4.  The output must be a single, valid JSON object, without any markdown formatting like \`\`\`json.

                **JSON to Translate:**
                ${englishPlanJsonString}
            `;

            const translationResponse = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: translationPrompt,
                config: {
                    responseMimeType: "application/json",
                }
            });

            const translatedJsonString = translationResponse.text.trim();
            const translatedPlan = JSON.parse(translatedJsonString) as SummaryData;
            return createResponse(translatedPlan);

        } catch (error) {
            console.error("Error translating plan to Arabic:", error);
            try {
                const englishPlan = JSON.parse(englishPlanJsonString.trim()) as SummaryData;
                return createResponse(englishPlan); // Fallback to English
            } catch (parseError) {
                console.error("Error parsing English plan after failed translation:", parseError);
                return createResponse(getDefaultSummary());
            }
        }
    }

    // --- STEP 3: If language was English, parse and return the English plan ---
    try {
        const englishPlan = JSON.parse(englishPlanJsonString.trim()) as SummaryData;
        return createResponse(englishPlan);
    } catch (error) {
        console.error("Error parsing the final English JSON:", error);
        return createResponse(getDefaultSummary());
    }

  } catch (error) {
    console.error('Error in handler:', error);
    return createResponse({ error: 'An internal server error occurred.' }, 500);
  }
}
