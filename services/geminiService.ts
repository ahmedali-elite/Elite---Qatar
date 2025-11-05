import type { UserData, SummaryData } from '../types';

// This function now calls our secure serverless function on Vercel
// which in turn calls the Gemini API.
export const getFullJourneySummary = async (userData: UserData, language: 'en' | 'ar'): Promise<SummaryData> => {
    console.log(`Requesting summary via serverless function for language: ${language}`);
    try {
        const response = await fetch('/api/generate-summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userData, language }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Serverless function error response:", errorText);
            throw new Error(`Failed to get summary: ${response.statusText}`);
        }

        const summaryData: SummaryData = await response.json();
        console.log("Successfully received summary from serverless function.");
        return summaryData;

    } catch (error) {
        console.error("Error fetching summary from serverless function:", error);
        // In case of a network error or if the function fails, we can return a default summary.
        // The default summary generation logic is now on the server, but we can have a minimal client-side fallback.
        return {
            executiveSummary: "Our AI is currently facing a connection issue. Please try again later. Based on your inputs, the clear next step is to build an action plan focusing on your goals.",
            timeline: [],
            kpiProjections: [],
            focusAreas: [],
            budgetAllocation: [],
            swotAnalysis: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
            customerPersona: { name: '', demographics: '', goals: [], painPoints: [] },
            challengesAnalysis: { summary: '', chartData: [] },
            goalRecommendations: [],
            gamification: { title: 'Innovator', badgeIcon: '💡' }
        };
    }
};
