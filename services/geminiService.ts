import type { UserData, SummaryData } from '../types';

/**
 * Fetches individual parts of the strategic plan concurrently. This architecture is fast and resilient.
 * It uses Promise.allSettled to ensure that the failure of one part does not prevent others from loading.
 *
 * @param userData - The user's input data.
 * @param language - The target language for the output.
 * @param onUpdate - A callback function to progressively update the UI with successfully fetched parts.
 * @param onError - A callback function to handle critical errors where no parts can be fetched.
 */
export const getFullJourneySummary = async (
    userData: UserData,
    language: 'en' | 'ar',
    onUpdate: (data: Partial<SummaryData>) => void,
    onError: (error: Error) => void,
): Promise<void> => {
    console.log(`Requesting full summary with ROBUST PARALLEL JSON architecture for language: ${language}`);
    
    const parts: (keyof SummaryData)[] = [
        'executiveSummary',
        'goalRecommendations',
        'swotAnalysis',
        'customerPersona',
        'timeline',
        'kpiProjections',
        'budgetAllocation',
        'gamification',
    ];

    const fetchPromises = parts.map(part =>
        fetch('/api/generate-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userData, language, part }),
        }).then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`[${part}] HTTP error ${res.status}: ${errorText}`);
            }
            return res.json();
        })
    );

    const results = await Promise.allSettled(fetchPromises);
    
    let allFailed = true;
    let errors: string[] = [];

    results.forEach((result, index) => {
        const partName = parts[index];
        if (result.status === 'fulfilled') {
            // Update the UI with the successfully fetched part
            onUpdate(result.value);
            allFailed = false;
        } else {
            // CRITICAL FIX: Log the error, but do NOT update the UI state with an incompatible
            // error object. The UI component will now correctly continue showing a skeleton
            // loader for this failed part, preventing the entire application from crashing.
            console.error(`Failed to fetch part '${partName}':`, result.reason?.message);
            errors.push(result.reason?.message);
        }
    });

    if (allFailed) {
        // If every single part failed, trigger the main error handler.
        const combinedError = new Error(errors.join('; '));
        onError(combinedError);
    }
};