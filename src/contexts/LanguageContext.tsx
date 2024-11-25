import { ReactNode, createContext, useContext } from 'react';

// ----------------------------------------------------------------------


export type LanguageContextType = {
    getLocalizationValue(key:string) : string;
};


const LanguageContext = createContext<LanguageContextType | null>(null);
function LanguagesProvider({ children }: { children: ReactNode }) {
  const getLocalizationValue = (key:string) : string=>{
    return key;
  }
  return (
    <LanguageContext.Provider
      value={{
          getLocalizationValue,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) throw new Error('Language context must be use inside LanguageProvider');

  return context;
};
export {LanguageContext, LanguagesProvider,useLanguage };
