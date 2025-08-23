import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Define types
type Language = 'en'; // Only English is supported now
type Translations = { [key: string]: any };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void; // Kept for type compatibility, but is a no-op
  t: (key: string) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState<Translations | null>(null);

  // Load English translations asynchronously
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const enRes = await fetch('/locales/en.json');
        const en = await enRes.json();
        setTranslations(en);
      } catch (error) {
        console.error("Failed to load translation file:", error);
      }
    };
    fetchTranslations();
  }, []);

  // No-op function for setting language
  const setLanguage = () => {};

  // Translation function
  const t = useCallback((key: string): string => {
    if (!translations) {
      return key; // Return key if translations are not loaded yet
    }
    const keys = key.split('.');
    
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Key not found
      }
    }

    return String(result);
  }, [translations]);

  // Don't render children until translations are loaded to prevent flicker
  if (!translations) {
    return null; // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ language: 'en', setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the context
export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};