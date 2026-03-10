import { Career } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CareerService } from './careerService';

// ─── MISTRAL API ──────────────────────────────────────────────────────────────
// Free API key from https://console.mistral.ai/
// For now, this is a placeholder. You'll need to create a free account and paste your key here.
const MISTRAL_API_KEY = process.env.EXPO_PUBLIC_MISTRAL_API_KEY || 'Y39jhXSABJCupDUzprBkfOojh3sSMYK09';

const CACHE_KEY = 'talentra_mistral_ai_cache';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours caching

// ─── Cache helpers ────────────────────────────────────────────────────────────
interface CacheEntry { key: string; result: AIAnalysisResult; ts: number; }

async function readCache(key: string): Promise<AIAnalysisResult | null> {
    try {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const entry: CacheEntry = JSON.parse(raw);
        if (entry.key !== key) return null;
        if (Date.now() - entry.ts > CACHE_TTL_MS) return null;
        return entry.result;
    } catch { return null; }
}

async function writeCache(key: string, result: AIAnalysisResult) {
    try {
        const entry: CacheEntry = { key, result, ts: Date.now() };
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch { }
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AICareerSuggestion extends Career {
    whyFit: string;
    fitScore: number;
    timeToJob: string;
}

export interface AIAnalysisResult {
    suggestions: AICareerSuggestion[];
    analysisNote: string;
    generatedAt: string;
    source: 'remote' | 'local';
}

// ─── Prompt builder ───────────────────────────────────────────────────────────
function buildPrompt(
    interests: string[],
    background: string,
    experience: string,
    goals: string[],
    availableCareers: { id: string; title: string; category: string }[]
): string {
    return `You are Talentra, an expert Indian career counsellor.

User Profile:
- Interests: ${interests.join(', ')}
- Background: ${background}
- Experience: ${experience}
- Goals: ${goals.join(', ')}

Available Careers in our database:
${JSON.stringify(availableCareers)}

Task:
You MUST pick EXACTLY 3 careers from the "Available Careers" list that best match the user's profile.

Rules:
1. "careerId" MUST perfectly match the "id" from the available careers array.
2. "whyFit" must be a 1-sentence personal explanation referencing their specific background/goals.
3. "fitScore" should be between 70 and 99.
4. "timeToJob" should be realistic for India (e.g., "4–6 months").
5. Return ONLY JSON. No markdown, no comments.

Expected JSON Structure:
{
  "analysisNote": "A warm 1-sentence greeting addressing their goals.",
  "topPicks": [
    {
      "careerId": "string",
      "whyFit": "string",
      "fitScore": 85,
      "timeToJob": "4–6 months"
    }
  ]
}`;
}

// ─── Main AI Service ──────────────────────────────────────────────────────────
export class AIService {
    static async getCareerSuggestions(
        interests: string[],
        background: string,
        experience: string,
        goals: string[]
    ): Promise<AIAnalysisResult> {
        const cacheKey = [interests.slice().sort().join(','), background, experience, goals.slice().sort().join(',')].join('|');
        const cached = await readCache(cacheKey);
        if (cached) {
            return cached;
        }

        const allCareers = await CareerService.getCareers();
        const apiKeyLooksReal = !!MISTRAL_API_KEY && MISTRAL_API_KEY !== 'Y39jhXSABJCupDUzprBkfOojh3sSMYK09';

        if (!apiKeyLooksReal) {
            const fallback = await AIService.getFallbackSuggestions(interests);
            await writeCache(cacheKey, fallback);
            return fallback;
        }

        const availableOptions = allCareers.map(c => ({ id: c.$id, title: c.title, category: c.category }));
        const prompt = buildPrompt(interests, background, experience, goals, availableOptions);

        try {
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'mistral-small-latest',
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: 'You are a helpful JSON-only AI assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.2
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Mistral API Error: ${response.status} ${errorData}`);
            }

            const result = await response.json();
            const content = result.choices[0].message.content;
            const parsed = JSON.parse(content);

            const suggestions: AICareerSuggestion[] = [];
            for (const pick of parsed.topPicks || []) {
                const matchedCareer = allCareers.find(c => c.$id === pick.careerId);
                if (matchedCareer) {
                    suggestions.push({
                        ...matchedCareer,
                        whyFit: pick.whyFit || 'Matches your profile.',
                        fitScore: pick.fitScore || 80,
                        timeToJob: pick.timeToJob || '3–6 months'
                    });
                }
            }

            const analysis: AIAnalysisResult = {
                suggestions,
                analysisNote: parsed.analysisNote || 'Here are some top picks for you.',
                generatedAt: new Date().toISOString(),
                source: 'remote',
            };

            if (suggestions.length > 0) {
                await writeCache(cacheKey, analysis);
            }

            return analysis;
        } catch (error) {
            const fallback = await AIService.getFallbackSuggestions(interests);
            await writeCache(cacheKey, fallback);
            return fallback;
        }
    }

    // Fallback static suggestions if Mistral fails 
    static async getFallbackSuggestions(interests: string[]): Promise<AIAnalysisResult> {
        let allCareers = await CareerService.getCareers();

        let matches = allCareers.filter(career =>
            interests.some(interest =>
                career.category.toLowerCase().includes(interest.toLowerCase()) ||
                career.requiredSkills.some(s => s.toLowerCase().includes(interest.toLowerCase()))
            )
        );

        if (matches.length === 0) {
            matches = allCareers.filter(c => c.isHot);
        }

        const top3 = matches.slice(0, 3);
        const suggestions: AICareerSuggestion[] = top3.map(career => ({
            ...career,
            whyFit: 'A strong career path in the current Indian tech landscape.',
            fitScore: 80,
            timeToJob: '4–6 months',
        }));

        return {
            suggestions,
            analysisNote: 'Displaying our curated local suggestions based on your interests.',
            generatedAt: new Date().toISOString(),
            source: 'local',
        };
    }
}
