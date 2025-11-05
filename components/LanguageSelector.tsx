import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇶🇦' },
  ];

  return (
    <div className="flex items-center bg-gray-200 rounded-full p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as 'en' | 'ar')}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 flex items-center gap-2 ${
            language === lang.code ? 'bg-white shadow' : 'text-gray-600'
          }`}
        >
          <span>{lang.flag}</span>
          <span className="hidden sm:inline">{lang.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
