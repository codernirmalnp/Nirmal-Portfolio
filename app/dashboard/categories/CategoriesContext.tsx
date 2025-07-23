import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Category {
  id: string;
  name: string;
}

interface CategoriesContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  removeCategory: (id: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const removeCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, setCategories, removeCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategoriesContext must be used within a CategoriesProvider');
  }
  return context;
}; 