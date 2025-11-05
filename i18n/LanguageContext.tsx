import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<Language, any>>({ en: {}, ar: {} });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enRes, arRes] = await Promise.all([
          fetch('./i18n/en.json'),
          fetch('./i18n/ar.json')
        ]);
        if (!enRes.ok || !arRes.ok) {
          throw new Error('Failed to fetch translation files');
        }
        const enData = await enRes.json();
        const arData = await arRes.json();
        setTranslations({ en: enData, ar: arData });
      } catch (error) {
        console.error("Failed to load translation files:", error);
      }
    };
    fetchTranslations();
  }, []);

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language]);

  const t = useCallback((key: string, options?: Record<string, any>): string => {
    const keys = key.split('.');
    let result: any = translations[language];

    if (!result || Object.keys(result).length === 0) {
      return key; // Return key if translations are not loaded yet
    }
    
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Return key if translation is not found
      }
    }
    
    if (typeof result !== 'string') {
        return key;
    }

    let str = result as string;
    if (options) {
      Object.entries(options).forEach(([optKey, value]) => {
        // Fix: Use a regex that matches single curly braces {key} instead of double {{key}}
        str = str.replace(new RegExp(`{${optKey}}`, 'g'), String(value));
      });
    }
    return str;
  }, [language, translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};