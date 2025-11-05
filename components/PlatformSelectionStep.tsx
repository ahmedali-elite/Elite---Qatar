import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import type { UserData, ContentOption } from '../types';
import { PLATFORMS } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';

interface PlatformSelectionStepProps {
  onNext: (data: Partial<UserData>) => void;
  userData: UserData;
  onPrevious: () => void;
}

const PlatformCard: React.FC<{ option: ContentOption; onSelect: () => void; isSelected: boolean }> = ({ option, onSelect, isSelected }) => {
  const { t } = useLanguage();
  const Icon = option.icon;
  return (
    <motion.div
      onClick={onSelect}
      className={`cursor-pointer p-6 rounded-lg border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 h-full ${isSelected ? 'bg-green-100 border-brand-green' : 'bg-brand-gray border-gray-200 hover:border-brand-green'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={`w-12 h-12 ${isSelected ? 'text-brand-green' : 'text-gray-600'}`} />
      <h3 className="text-lg font-semibold text-gray-800">{t(option.title)}</h3>
    </motion.div>
  );
};

const PlatformSelectionStep: React.FC<PlatformSelectionStepProps> = ({ onNext, userData, onPrevious }) => {
  const { t } = useLanguage();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(userData.platforms || []);

  const handleSelectPlatform = (platformId: string) => {
    const isSelected = selectedPlatforms.includes(platformId);
    setSelectedPlatforms(isSelected
      ? selectedPlatforms.filter(p => p !== platformId)
      : [...selectedPlatforms, platformId]
    );
  };

  const canProceed = selectedPlatforms.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-28 pb-12 animate-fade-in bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-900">{t('platforms.title')}</h2>
      <p className="text-gray-500 mb-8 text-center">{t('platforms.subtitle')}</p>

      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-4">
        {PLATFORMS.map(platform => (
          <PlatformCard
            key={platform.id}
            option={platform}
            onSelect={() => handleSelectPlatform(platform.id)}
            isSelected={selectedPlatforms.includes(platform.id)}
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
            onClick={() => onNext({ platforms: selectedPlatforms })}
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

export default PlatformSelectionStep;