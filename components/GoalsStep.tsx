import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import type { UserData, ContentOption } from '../types';
import { GOALS } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';

interface GoalsStepProps {
  onNext: (data: Partial<UserData>) => void;
  userData: UserData;
  onPrevious: () => void;
}

interface GoalCardProps {
  option: ContentOption;
  onSelect: () => void;
  isSelected: boolean;
}

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
// FIX: Wrap in React.memo to ensure it's treated as a component, resolving prop type errors for `key`.
const GoalCard = React.memo(({ option, onSelect, isSelected }: GoalCardProps) => {
    const { t } = useLanguage();
    const Icon = option.icon;
    const title = t(option.title);
    return (
        <motion.div
            layout
            onClick={onSelect}
            className={`cursor-pointer p-4 md:p-6 rounded-lg border-2 transition-all duration-300 flex items-center gap-4 ${isSelected ? 'bg-green-100 border-brand-green' : 'bg-brand-gray border-gray-200 hover:border-brand-green'}`}
            whileHover={{ scale: 1.05 }}
        >
            <Icon className={`w-8 h-8 md:w-10 md:h-10 ${isSelected ? 'text-brand-green' : 'text-gray-600'}`} />
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h3>
        </motion.div>
    );
});

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
const GoalsStep = ({ onNext, userData, onPrevious }: GoalsStepProps) => {
  const { t } = useLanguage();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(userData.goals || []);

  const handleSelectGoal = useCallback((goalId: string) => {
    const isSelected = selectedGoals.includes(goalId);
    const newSelectedGoals = isSelected
      ? selectedGoals.filter(g => g !== goalId)
      : [...selectedGoals, goalId];
    
    setSelectedGoals(newSelectedGoals);
  }, [selectedGoals]);

  const canProceed = selectedGoals.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-28 pb-12 animate-fade-in bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-900">{t('goals.title')}</h2>
      <p className="text-gray-500 mb-8 text-center">{t('goals.subtitle')}</p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOALS.map(goal => (
          <GoalCard
            key={goal.id}
            option={goal}
            onSelect={() => handleSelectGoal(goal.id)}
            isSelected={selectedGoals.includes(goal.id)}
          />
        ))}
      </div>
      
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-4xl">
        <motion.button
            onClick={onPrevious}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-gray-300 text-gray-700 font-bold rounded-full text-xl transition-all duration-300 hover:bg-gray-100 hover:border-gray-400 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowLeft /> {t('navigation.previous')}
        </motion.button>
        <motion.button
            onClick={() => onNext({ goals: selectedGoals })}
            disabled={!canProceed}
            className="w-full sm:w-auto px-8 py-4 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-full shadow-lg text-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            whileHover={canProceed ? { scale: 1.05, boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' } : {}}
            whileTap={canProceed ? { scale: 0.95 } : {}}
        >
            <CheckCircle2 /> {t('navigation.continue')}
        </motion.button>
      </div>
    </div>
  );
};

export default GoalsStep;