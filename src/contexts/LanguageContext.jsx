import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const LanguageContext = createContext();

// Language options
export const LANGUAGES = {
  PT_BR: 'pt-BR',
  EN: 'en'
};

// Create a provider component
export function LanguageProvider({ children }) {
  // Initialize language from localStorage or default to PT-BR
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || LANGUAGES.PT_BR;
  });

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Function to toggle between languages
  const toggleLanguage = () => {
    setLanguage(prevLang => 
      prevLang === LANGUAGES.PT_BR ? LANGUAGES.EN : LANGUAGES.PT_BR
    );
  };

  // Function to set specific language
  const changeLanguage = (newLanguage) => {
    if (Object.values(LANGUAGES).includes(newLanguage)) {
      setLanguage(newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage, 
      changeLanguage,
      LANGUAGES 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}