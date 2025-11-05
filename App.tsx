import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getFullJourneySummary } from './services/geminiService';
import type { UserData, GamificationData, SummaryData } from './types';

// Import Step Components
import WelcomeScreen from './components/WelcomeScreen';
import BasicInfoStep from './components/BasicInfoStep';
import GoalsStep from './components/GoalsStep';
import PlatformSelectionStep from './components/PlatformSelectionStep';
import ChallengesStep from './components/ChallengesStep';
import SummaryStep from './components/SummaryStep';
import Header from './components/Header';
import ContactModal from './components/ContactModal';
import { Loader2 } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

const TOTAL_STEPS = 5;

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    industry: '',
    subIndustry: '',
    companySize: '',
    goals: [],
    challenges: [],
    platforms: [],
  });
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    points: 0,
    badges: [],
    title: 'Explorer',
  });
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const addPoints = (amount: number) => {
    setGamificationData(prev => ({ ...prev, points: prev.points + amount }));
  };

  const addBadge = useCallback((badgeName: string) => {
    setGamificationData(prev => {
      if (prev.badges.includes(badgeName)) {
        return prev;
      }
      return { ...prev, badges: [...prev.badges, badgeName] };
    });
  }, []);

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };
  
  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleUpdateUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  }, []);

  const handleInfoSubmit = useCallback((data: Partial<UserData>) => {
    handleUpdateUserData(data);
    addPoints(100);
    addBadge('Insightful Informant');
    nextStep();
  }, [handleUpdateUserData, addBadge]);

  const handleGoalsSubmit = useCallback((data: Partial<UserData>) => {
    handleUpdateUserData(data);
    addPoints(150);
    addBadge('Goal Setter');
    nextStep();
  }, [handleUpdateUserData, addBadge]);
  
  const handlePlatformsSubmit = useCallback((data: Partial<UserData>) => {
    handleUpdateUserData(data);
    addPoints(150);
    addBadge('Digital Architect');
    nextStep();
  }, [handleUpdateUserData, addBadge]);

  const handleChallengesSubmit = useCallback((data: Partial<UserData>) => {
    const finalUserDataWithIDs = { ...userData, ...data };
    handleUpdateUserData(data);

    addPoints(200);
    addBadge('Challenge Tackler');

    if (finalUserDataWithIDs.goals.length >= 3 && finalUserDataWithIDs.challenges.length >= 3) {
      addPoints(250);
      addBadge('Master Strategist');
    }

    // Translate IDs to strings for the API call
    const translatedUserData = {
        ...finalUserDataWithIDs,
        industry: t(`constants.industries.${finalUserDataWithIDs.industry}`),
        subIndustry: t(`constants.sub_industries.${finalUserDataWithIDs.subIndustry}`),
        companySize: t(`constants.company_sizes.${finalUserDataWithIDs.companySize}`),
        goals: finalUserDataWithIDs.goals.map(id => t(`constants.goals.${id}`)),
        challenges: finalUserDataWithIDs.challenges.map(id => t(`constants.challenges.${id}`)),
        platforms: finalUserDataWithIDs.platforms.map(id => t(`constants.platforms.${id}`)),
    };

    setIsLoading(true);
    getFullJourneySummary(translatedUserData, language).then(apiResponse => {
        setSummaryData(apiResponse);
        setGamificationData(prev => ({ ...prev, title: apiResponse.gamification.title }))
    }).finally(() => {
        setIsLoading(false);
        nextStep();
    });
  }, [addBadge, userData, handleUpdateUserData, language, t]);

  const renderStep = () => {
    if (isLoading) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center text-center p-4 bg-white">
          <Loader2 className="w-16 h-16 animate-spin text-brand-green mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">{t('loading.title')}</h2>
          <p className="text-gray-500 mt-2">{t('loading.subtitle')}</p>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return <WelcomeScreen onStart={() => { addPoints(50); addBadge('Journey Starter'); nextStep(); }} />;
      case 1:
        return <BasicInfoStep onNext={handleInfoSubmit} userData={userData} />;
      case 2:
        return <GoalsStep onNext={handleGoalsSubmit} userData={userData} onPrevious={previousStep} />;
      case 3:
        return <PlatformSelectionStep onNext={handlePlatformsSubmit} userData={userData} onPrevious={previousStep} />;
      case 4:
        return <ChallengesStep onNext={handleChallengesSubmit} userData={userData} onPrevious={previousStep} />;
      case 5:
        return <SummaryStep summaryData={summaryData} gamificationData={gamificationData} userData={userData} onPrevious={previousStep} onBook={() => setIsContactModalOpen(true)} />;
      default:
        return <WelcomeScreen onStart={() => setCurrentStep(1)} />;
    }
  };

  return (
    <main className="bg-white">
      {currentStep > 0 && currentStep <= TOTAL_STEPS && (
        <Header 
          gamificationData={gamificationData} 
        />
      )}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        userData={userData}
        summaryData={summaryData}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: document.dir === 'rtl' ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: document.dir === 'rtl' ? 50 : -50 }}
          transition={{ duration: 0.5 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default App;