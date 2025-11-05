import type { ContentOption, SubIndustryData } from './types';
import { Briefcase, Building2, Rocket, ShoppingCart, Cpu, Shield, DollarSign, Target, Users, Zap, BarChart, Lightbulb, BrainCircuit, HeartPulse, Home, GraduationCap, Shirt, MessageSquareQuote, Megaphone, Repeat, UsersRound, LineChart, Server, Landmark, Globe, Store, Dumbbell, UtensilsCrossed } from 'lucide-react';
import type { ElementType } from 'react';
import { SiGoogle, SiInstagram, SiTiktok, SiFacebook, SiLinkedin, SiX } from 'react-icons/si';

export const INDUSTRIES: ContentOption[] = [
  { id: 'tech', title: 'constants.industries.tech', icon: Cpu },
  { id: 'ecommerce', title: 'constants.industries.ecommerce', icon: ShoppingCart },
  { id: 'healthcare', title: 'constants.industries.healthcare', icon: HeartPulse },
  { id: 'finance', title: 'constants.industries.finance', icon: DollarSign },
  { id: 'realestate', title: 'constants.industries.realestate', icon: Home },
  { id: 'education', title: 'constants.industries.education', icon: GraduationCap },
  { id: 'fashion', title: 'constants.industries.fashion', icon: Shirt },
  { id: 'food', title: 'constants.industries.food', icon: UtensilsCrossed },
];

export const SUB_INDUSTRIES: SubIndustryData = {
    tech: [
        { id: 'saas', title: 'constants.sub_industries.saas', icon: Server },
        { id: 'fintech', title: 'constants.sub_industries.fintech', icon: Landmark },
        { id: 'ai', title: 'constants.sub_industries.ai', icon: BrainCircuit },
        { id: 'hardware', title: 'constants.sub_industries.hardware', icon: Cpu },
    ],
    ecommerce: [
        { id: 'retail', title: 'constants.sub_industries.retail', icon: Store },
        { id: 'marketplace', title: 'constants.sub_industries.marketplace', icon: Globe },
        { id: 'subscription', title: 'constants.sub_industries.subscription', icon: Repeat },
        { id: 'dropshipping', title: 'constants.sub_industries.dropshipping', icon: ShoppingCart },
    ],
    healthcare: [
        { id: 'telehealth', title: 'constants.sub_industries.telehealth', icon: HeartPulse },
        { id: 'medicaldevices', title: 'constants.sub_industries.medicaldevices', icon: Dumbbell },
        { id: 'pharma', title: 'constants.sub_industries.pharma', icon: Briefcase },
        { id: 'wellness', title: 'constants.sub_industries.wellness', icon: Dumbbell },
    ],
    finance: [
        { id: 'banking', title: 'constants.sub_industries.banking', icon: Landmark },
        { id: 'investment', title: 'constants.sub_industries.investment', icon: LineChart },
        { id: 'insurance', title: 'constants.sub_industries.insurance', icon: Shield },
        { id: 'crypto', title: 'constants.sub_industries.crypto', icon: DollarSign },
    ],
    realestate: [
        { id: 'residential', title: 'constants.sub_industries.residential', icon: Home },
        { id: 'commercial', title: 'constants.sub_industries.commercial', icon: Building2 },
        { id: 'propertymgmt', title: 'constants.sub_industries.propertymgmt', icon: Briefcase },
        { id: 'proptech', title: 'constants.sub_industries.proptech', icon: Cpu },
    ],
    education: [
        { id: 'edtech', title: 'constants.sub_industries.edtech', icon: Cpu },
        { id: 'onlinecourses', title: 'constants.sub_industries.onlinecourses', icon: GraduationCap },
        { id: 'tutoring', title: 'constants.sub_industries.tutoring', icon: Users },
        { id: 'university', title: 'constants.sub_industries.university', icon: Landmark },
    ],
    fashion: [
        { id: 'fastfashion', title: 'constants.sub_industries.fastfashion', icon: Zap },
        { id: 'luxury', title: 'constants.sub_industries.luxury', icon: Shirt },
        { id: 'sustainable', title: 'constants.sub_industries.sustainable', icon: Repeat },
        { id: 'accessories', title: 'constants.sub_industries.accessories', icon: Briefcase },
    ],
    food: [
        { id: 'restaurant', title: 'constants.sub_industries.restaurant', icon: UtensilsCrossed },
        { id: 'fooddelivery', title: 'constants.sub_industries.fooddelivery', icon: Rocket },
        { id: 'packagedgoods', title: 'constants.sub_industries.packagedgoods', icon: ShoppingCart },
        { id: 'healthfood', title: 'constants.sub_industries.healthfood', icon: HeartPulse },
    ],
};


export const COMPANY_SIZES: ContentOption[] = [
    { id: 'startup', title: 'constants.company_sizes.startup', icon: Rocket },
    { id: 'smb', title: 'constants.company_sizes.smb', icon: Users },
    { id: 'mid-market', title: 'constants.company_sizes.mid-market', icon: Building2 },
    { id: 'enterprise', title: 'constants.company_sizes.enterprise', icon: BarChart },
];

export const GOALS: ContentOption[] = [
  { id: 'awareness', title: 'constants.goals.awareness', icon: Megaphone },
  { id: 'leads', title: 'constants.goals.leads', icon: UsersRound },
  { id: 'conversion', title: 'constants.goals.conversion', icon: Repeat },
  { id: 'engagement', title: 'constants.goals.engagement', icon: MessageSquareQuote },
  { id: 'sales', title: 'constants.goals.sales', icon: ShoppingCart },
  { id: 'traffic', title: 'constants.goals.traffic', icon: LineChart },
];

export const CHALLENGES: ContentOption[] = [
  { id: 'budget', title: 'constants.challenges.budget', icon: DollarSign },
  { id: 'competition', title: 'constants.challenges.competition', icon: Shield },
  { id: 'tech', title: 'constants.challenges.tech', icon: Cpu },
  { id: 'talent', title: 'constants.challenges.talent', icon: Users },
];

export const PLATFORMS: ContentOption[] = [
  { id: 'google', title: 'constants.platforms.google', icon: SiGoogle },
  { id: 'instagram', title: 'constants.platforms.instagram', icon: SiInstagram },
  { id: 'facebook', title: 'constants.platforms.facebook', icon: SiFacebook },
  { id: 'tiktok', title: 'constants.platforms.tiktok', icon: SiTiktok },
  { id: 'linkedin', title: 'constants.platforms.linkedin', icon: SiLinkedin },
  { id: 'x', title: 'constants.platforms.x', icon: SiX },
];

export const BADGES: Record<string, { icon: ElementType; description: string }> = {
  'Journey Starter': { icon: Rocket, description: 'Began your personalized journey to success.' },
  'Insightful Informant': { icon: Lightbulb, description: 'Provided key insights about your business.' },
  'Goal Setter': { icon: Target, description: 'Defined clear and ambitious goals for the future.' },
  'Digital Architect': { icon: Building2, description: 'Selected your core digital marketing platforms.' },
  'Challenge Tackler': { icon: Shield, description: 'Identified and faced your primary challenges.' },
  'Master Strategist': { icon: BrainCircuit, description: 'Defined a complex strategy by setting 3+ goals and tackling 3+ challenges.' },
};