import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import type { UserData, ContentOption } from '../types';
import { CHALLENGES } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';

interface ChallengesStepProps {
  onNext: (data: Partial<UserData>) => void;
  userData: UserData;
  onPrevious: () => void;
}

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
const ChallengeCard = ({ option, onSelect, isSelected }: { option: ContentOption; onSelect: () => void; isSelected: boolean }) => {
    const { t } = useLanguage();
    const Icon = option.icon;
    return (
        <motion.div
            onClick={onSelect}
            className={`cursor-pointer p-6 rounded-lg border-2 text-center transition-all duration-300 h-full flex flex-col justify-center ${isSelected ? 'bg-green-100 border-brand-green' : 'bg-brand-gray border-gray-200 hover:border-brand-green'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Icon className={`w-12 h-12 mx-auto mb-3 ${isSelected ? 'text-brand-green' : 'text-gray-600'}`} />
            <h3 className="text-lg font-semibold text-gray-800">{t(option.title)}</h3>
        </motion.div>
    );
};

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
const ChallengesStep = ({ onNext, userData, onPrevious }: ChallengesStepProps) => {
  const { t } = useLanguage();
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>(userData.challenges || []);

  const handleSelectChallenge = (challengeId: string) => {
    const isSelected = selectedChallenges.includes(challengeId);
    setSelectedChallenges(isSelected
      ? selectedChallenges.filter(c => c !== challengeId)
      : [...selectedChallenges, challengeId]
    );
  };
  
  const canProceed = selectedChallenges.length > 0;

  const handleProceed = () => {
    onNext({ challenges: selectedChallenges });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-28 pb-12 animate-fade-in bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-900">{t('challenges.title')}</h2>
      <p className="text-gray-500 mb-8 text-center">{t('challenges.subtitle')}</p>

      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
        {CHALLENGES.map(challenge => (
          <ChallengeCard key={challenge.id} option={challenge} onSelect={() => handleSelectChallenge(challenge.id)} isSelected={selectedChallenges.includes(challenge.id)} />
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
            onClick={handleProceed}
            disabled={!canProceed}
            className="w-full sm:w-auto px-8 py-4 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-full shadow-lg text-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            whileHover={canProceed ? { scale: 1.05, boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' } : {}}
            whileTap={canProceed ? { scale: 0.95 } : {}}
        >
            <CheckCircle2 /> {t('challenges.generateButton')}
        </motion.button>
      </div>
    </div>
  );
};

export default ChallengesStep;