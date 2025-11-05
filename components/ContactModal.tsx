import React from 'react';
// Fix: Import Variants from framer-motion to explicitly type animation variants.
import { motion, AnimatePresence, Variants } from 'framer-motion';
// Fix: Removed unused MessageSquare import.
import { X, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import type { UserData, SummaryData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
  summaryData: SummaryData | null;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, userData, summaryData }) => {
    const { t } = useLanguage();
    if (!userData || !summaryData) return null;

    const WHATSAPP_NUMBER = "97455333434";

    const generateEmailBody = () => {
        return t('email.body', {
            name: userData.name,
            email: userData.email,
            industry: userData.industry,
            subIndustry: userData.subIndustry,
            companySize: userData.companySize,
            goals: userData.goals.join(', '),
            challenges: userData.challenges.join(', '),
            platforms: userData.platforms.join(', '),
            summary: summaryData.executiveSummary
        });
    };

    const handleEmailClick = () => {
        const subject = t('email.subject', { name: userData.name });
        const body = generateEmailBody();
        const yourEmail = "info@elite-qatar.net";
        window.location.href = `mailto:${yourEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        onClose();
    };
    
    const handleWhatsAppClick = () => {
        const body = generateEmailBody();
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
        window.open(whatsappUrl, '_blank');
        onClose();
    };

    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    // Fix: Explicitly type modalVariants with Variants to resolve TypeScript error with transition type.
    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } },
        exit: { opacity: 0, scale: 0.9 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    dir={document.documentElement.dir}
                >
                    <motion.div
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl font-bold text-center mb-2 text-gray-900">{t('contactModal.title')}</h3>
                        <p className="text-center text-gray-500 mb-6">{t('contactModal.subtitle')}</p>
                        <div className="space-y-4">
                            <motion.button 
                                onClick={handleWhatsAppClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full flex items-center justify-center gap-3 p-4 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors"
                            >
                                <FaWhatsapp size={24} /> {t('contactModal.whatsappButton')}
                            </motion.button>
                            <motion.button 
                                onClick={handleEmailClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-700 text-white font-bold rounded-lg shadow-md hover:bg-gray-800 transition-colors"
                            >
                                <Mail size={24} /> {t('contactModal.emailButton')}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Add translations to en.json
/*
"contactModal": {
  "title": "Let's Talk Strategy",
  "subtitle": "Choose your preferred way to connect with us.",
  "whatsappButton": "Contact via WhatsApp",
  "emailButton": "Contact via Email"
}
*/

// Add translations to ar.json
/*
"contactModal": {
  "title": "لنتحدث عن الاستراتيجية",
  "subtitle": "اختر طريقتك المفضلة للتواصل معنا.",
  "whatsappButton": "تواصل عبر واتساب",
  "emailButton": "تواصل عبر البريد الإلكتروني"
}
*/


export default ContactModal;