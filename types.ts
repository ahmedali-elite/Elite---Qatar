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

export interface ChartData {
  name: string;
  impact: number;
}

export interface KpiProjection {
    name: string;
    current: number;
    projected: number;
}

export interface TimelineMilestone {
    quarter: string;
    focus: string;
    milestones: string[];
}

export interface FocusArea {
    area: string;
    score: number;
}

export interface BudgetAllocation {
    name: string;
    value: number;
    color: string;
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

export interface SummaryData {
    executiveSummary: string;
    timeline: TimelineMilestone[];
    kpiProjections: KpiProjection[];
    focusAreas: FocusArea[];
    budgetAllocation: BudgetAllocation[];
    swotAnalysis: SwotAnalysis;
    customerPersona: CustomerPersona;
    challengesAnalysis: {
        summary: string;
        chartData: ChartData[];
    };
    goalRecommendations: GoalRecommendation[];
    gamification: {
        title: string;
        badgeIcon: string;
    };
}

export interface ContentOption {
  id: string;
  title: string;
  icon: ElementType;
}

export interface SubIndustryData {
    [key: string]: ContentOption[];
}