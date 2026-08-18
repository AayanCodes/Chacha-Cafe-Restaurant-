import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface NavigationContextType {
  currentPath: string;
  navigate: (to: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
  navigate: () => {},
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === to) return;

    window.history.pushState({}, '', to);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
