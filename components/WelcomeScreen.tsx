import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

const Logo: React.FC = () => (
    <div className="w-64 h-64">
        <iframe
            src="https://lottie.host/embed/82ee423b-ef2f-4c47-a7df-86da20e53d58/2lA2jaRA0B.lottie"
            className="w-full h-full border-none"
            title="Welcome Animation"
        ></iframe>
  </div>
);

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { t } = useLanguage();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center text-center p-4 bg-white relative overflow-hidden">
        {/* Particle background */}
        <div className="absolute inset-0 z-0">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-brand-green/30"
                    initial={{ 
                        x: Math.random() * window.innerWidth, 
                        y: Math.random() * window.innerHeight,
                        opacity: 0
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                    style={{
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`,
                    }}
                />
            ))}
        </div>

      <div className="z-10 flex flex-col items-center justify-center">
        <Logo />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900"
        >
          {t('welcome.title')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 max-w-2xl text-lg text-gray-600"
        >
          {t('welcome.subtitle')}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, type: 'spring', stiffness: 120 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(169, 206, 23, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="mt-10 px-8 py-4 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-full shadow-lg text-xl transition-all duration-300"
        >
          {t('welcome.startButton')}
        </motion.button>
      </div>
    </div>
  );
};

export default WelcomeScreen;