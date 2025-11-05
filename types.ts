import type { ElementType } from 'react';

export interface UserData {
  name: string;
  email: string;
  industry: string;
  subIndustry: string;
  companySize: string;
  goals: string[];
  challenges: string[];
  platforms: string[];
}

export interface GamificationData {
  points: number;
  badges: string[];
  title: string;
}

export interface SwotAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface CustomerPersona {
    name: string;
    demographics: string;
    goals: string[];
    painPoints: string[];
}

export interface GoalRecommendation {
    goal: string;
    recommendations: string[];
}

export interface TimelineEvent {
    quarter: string; // e.g., "Q1 2025"
    focus: string;
    keyActions: string[];
}

export interface KpiData {
    month: string;
    value: number;
}

export interface BudgetAllocation {
    channel: string;
    percentage: number;
}

// The original, detailed data structure for the full strategic plan.
export interface SummaryData {
    executiveSummary: string;
    goalRecommendations: GoalRecommendation[];
    swotAnalysis: SwotAnalysis;
    customerPersona: CustomerPersona;
    timeline: TimelineEvent[];
    kpiProjections: {
        name: string;
        data: KpiData[];
    }[];
    budgetAllocation: BudgetAllocation[];
    gamification: {
        title: string;
        badgeIcon: string;
    };
    // FIX: Added missing properties to align with API response and component usage.
    keyPriorities: string[];
    keyChannels: string[];
    metricsForSuccess: string[];
}


export interface ContentOption {
  id: string;
  title: string;
  icon: ElementType;
}

export interface SubIndustryData {
    [key: string]: ContentOption[];
}