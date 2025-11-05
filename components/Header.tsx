import React from 'react';
import { motion } from 'framer-motion';
import GamificationTracker from './GamificationTracker';
import { Phone, Globe } from 'lucide-react';
import type { GamificationData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';


interface HeaderProps {
    gamificationData: GamificationData;
}

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
const Header = ({ gamificationData }: HeaderProps) => {
    const { t } = useLanguage();

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 left-0 w-full p-4 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/80 shadow-sm"
        >
            <nav className="w-full max-w-7xl mx-auto flex justify-between items-center">
                <a href="https://elite-qatar.net" target="_blank" rel="noopener noreferrer">
                    <img 
                        src="https://www.elite-qatar.net/wp-content/uploads/2025/09/elite-logo-dark-1.png" 
                        alt="Elite Qatar Logo" 
                        className="h-10 w-auto"
                    />
                </a>
                <div className="flex items-center gap-2 md:gap-4">
                    <LanguageSelector />
                    <GamificationTracker points={gamificationData.points} badges={gamificationData.badges} />
                    <a
                        href="https://www.elite-qatar.net/smart-marketing-in-qatar/#form"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-green-dark bg-brand-green/20 rounded-full hover:bg-brand-green/30 transition-colors"
                    >
                        <Phone size={16} />
                        {t('header.bookConsultation')}
                    </a>
                    <a 
                        href="https://elite-qatar.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                        <Globe size={16} />
                        {t('header.visitWebsite')}
                    </a>
                </div>
            </nav>
        </motion.header>
    );
};

export default Header;