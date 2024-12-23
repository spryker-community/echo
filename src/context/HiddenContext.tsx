import React, { createContext, useContext, useState, useEffect } from 'react';

interface HiddenContextType {
  hiddenPosts: Set<string>;
  hidePost: (id: string) => void;
  unhidePost: (id: string) => void;
  unhideAll: () => void;
  isHidden: (id: string) => boolean;
  hiddenCount: number;
}

const STORAGE_KEY = 'echo-hidden-posts';

const HiddenContext = createContext<HiddenContextType | undefined>(undefined);

export function HiddenProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage if available
  const [hiddenPosts, setHiddenPosts] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Save to localStorage whenever hiddenPosts changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(hiddenPosts)));
  }, [hiddenPosts]);

  const hidePost = (id: string) => {
    setHiddenPosts(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const unhidePost = (id: string) => {
    setHiddenPosts(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const unhideAll = () => {
    setHiddenPosts(new Set());
  };

  const isHidden = (id: string) => hiddenPosts.has(id);
  const hiddenCount = hiddenPosts.size;

  return (
    <HiddenContext.Provider value={{ 
      hiddenPosts, 
      hidePost, 
      unhidePost, 
      unhideAll, 
      isHidden,
      hiddenCount 
    }}>
      {children}
    </HiddenContext.Provider>
  );
}

export function useHidden() {
  const context = useContext(HiddenContext);
  if (context === undefined) {
    throw new Error('useHidden must be used within a HiddenProvider');
  }
  return context;
}
