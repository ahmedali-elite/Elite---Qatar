import React, { useState, useCallback, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { UserData, GamificationData, SummaryData } from './types';

// Import Step Components
import WelcomeScreen from './components/WelcomeScreen';
import BasicInfoStep from './components/BasicInfoStep';
import GoalsStep from './components/GoalsStep';
import PlatformSelectionStep from './components/PlatformSelectionStep';
import ChallengesStep from './components/ChallengesStep';
import SummaryStep from './components/SummaryStep'; // No longer lazy loaded
import Header from './components/Header';
import ContactModal from './components/ContactModal';
import { Loader2 } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

const TOTAL_STEPS = 5;

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();
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
  // The summaryData state is now managed within the SummaryStep itself.
  // We keep a copy here mainly for the ContactModal.
  const [finalSummaryData, setFinalSummaryData] = useState<SummaryData | null>(null);


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
    const finalUserData = { ...userData, ...data };
    handleUpdateUserData(data);

    addPoints(200);
    addBadge('Challenge Tackler');

    if (finalUserData.goals.length >= 3 && finalUserData.challenges.length >= 3) {
      addPoints(250);
      addBadge('Master Strategist');
    }
    
    // NO MORE LOADING SCREEN. NAVIGATE DIRECTLY TO THE DASHBOARD.
    nextStep();

  }, [addBadge, userData, handleUpdateUserData]);

  const renderStep = () => {
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
        // Pass the complete user data to SummaryStep, which will handle its own data fetching and state.
        return (
            <SummaryStep
                gamificationData={gamificationData}
                userData={userData}
                onPrevious={previousStep}
                onBook={() => setIsContactModalOpen(true)}
            />
        );
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
        summaryData={finalSummaryData} // The modal might need final data, though it's not the primary display.
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