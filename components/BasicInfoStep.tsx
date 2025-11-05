import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotMessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import type { UserData, ContentOption } from '../types';
import { INDUSTRIES, SUB_INDUSTRIES, COMPANY_SIZES } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';

interface BasicInfoStepProps {
  onNext: (data: Partial<UserData>) => void;
  userData: UserData;
}

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
// FIX: Wrap in React.memo to ensure it's treated as a component, resolving prop type errors for `key`.
const InfoCard = React.memo(({ option, onSelect, isSelected }: { option: ContentOption; onSelect: () => void; isSelected: boolean }) => {
  const { t } = useLanguage();
  const Icon = option.icon;
  return (
    <motion.div
      onClick={onSelect}
      className={`cursor-pointer p-4 md:p-6 rounded-lg border-2 text-center transition-all duration-300 h-full flex flex-col justify-center ${isSelected ? 'bg-green-100 border-brand-green' : 'bg-brand-gray border-gray-200 hover:border-brand-green'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 ${isSelected ? 'text-brand-green' : 'text-gray-600'}`} />
      <h3 className="text-base md:text-lg font-semibold text-gray-800">{t(option.title)}</h3>
    </motion.div>
  );
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
const BasicInfoStep = ({ onNext, userData }: BasicInfoStepProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState(userData.name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [selectedIndustry, setSelectedIndustry] = useState(userData.industry || '');
  const [selectedSubIndustry, setSelectedSubIndustry] = useState(userData.subIndustry || '');
  const [selectedCompanySize, setSelectedCompanySize] = useState(userData.companySize || '');
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError(t('basicInfo.emailRequired'));
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError(t('basicInfo.emailInvalid'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (emailError) {
      validateEmail(newEmail);
    }
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };
  
  const handleIndustrySelect = useCallback((selectedIndustryOption: ContentOption) => {
    setSelectedIndustry(selectedIndustryOption.id);
    setSelectedSubIndustry(''); // Reset sub-industry on new main industry selection
    setWelcomeMessage(t('basicInfo.welcomeMessage', { industry: t(selectedIndustryOption.title) }));
  }, [t]);
  
  const canProceed = name && email && !emailError && selectedIndustry && selectedSubIndustry && selectedCompanySize;

  const handleNextClick = () => {
      const isEmailValid = validateEmail(email);
      if (canProceed && isEmailValid) {
          onNext({ name, email, industry: selectedIndustry, subIndustry: selectedSubIndustry, companySize: selectedCompanySize });
      }
  };

  const currentSubIndustries = SUB_INDUSTRIES[selectedIndustry] || [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-28 pb-12 animate-fade-in bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-900">{t('basicInfo.title')}</h2>
      <p className="text-gray-500 mb-8 text-center">{t('basicInfo.subtitle')}</p>

      <div className="w-full max-w-5xl space-y-10">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-brand-green text-center">{t('basicInfo.contactInfo')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder={t('basicInfo.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
              required
            />
            <div className="relative">
              <input
                type="email"
                placeholder={t('basicInfo.emailPlaceholder')}
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`w-full p-4 border-2 rounded-lg focus:outline-none ${emailError ? 'border-red-500' : 'border-gray-200 focus:border-brand-green'}`}
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {emailError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4 text-brand-green text-center">{t('basicInfo.industryTitle')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INDUSTRIES.map(ind => (
              <InfoCard key={ind.id} option={ind} onSelect={() => handleIndustrySelect(ind)} isSelected={selectedIndustry === ind.id} />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedIndustry && currentSubIndustries.length > 0 && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-brand-green text-center">{t('basicInfo.subIndustryTitle')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentSubIndustries.map(subInd => (
                  <InfoCard key={subInd.id} option={subInd} onSelect={() => setSelectedSubIndustry(subInd.id)} isSelected={selectedSubIndustry === subInd.id} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {welcomeMessage && (
            <motion.div
              key="ai-message-bubble"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto"
            >
              <BotMessageSquare className="w-10 h-10 text-brand-green mt-1 flex-shrink-0" />
              <div className="pt-1">
                <p className="text-gray-700 italic">"{welcomeMessage}"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <h3 className="text-2xl font-semibold mb-4 text-brand-green text-center">{t('basicInfo.companySizeTitle')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COMPANY_SIZES.map(size => (
              <InfoCard key={size.id} option={size} onSelect={() => setSelectedCompanySize(size.id)} isSelected={selectedCompanySize === size.id} />
            ))}
          </div>
        </div>
      </div>
      
      <motion.button
        onClick={handleNextClick}
        disabled={!canProceed}
        className="mt-12 px-8 py-4 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-full shadow-lg text-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
        whileHover={canProceed ? { scale: 1.05, boxShadow: '0 0 25px rgba(169, 206, 23, 0.5)' } : {}}
        whileTap={canProceed ? { scale: 0.95 } : {}}
      >
        <CheckCircle2 /> {t('navigation.continue')}
      </motion.button>
    </div>
  );
};

export default BasicInfoStep;