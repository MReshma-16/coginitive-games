import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from '../locales/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('memoryroots_lang') || 'en';
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
      localStorage.setItem('memoryroots_lang', langCode);
    }
  };

  // Helper function to get translation object or nested string
  const t = translations[currentLang] || translations.en;

  const currentLangObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, languages, currentLangObj }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
