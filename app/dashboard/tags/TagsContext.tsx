import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Tag {
  id: string;
  name: string;
}

interface TagsContextType {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  removeTag: (id: string) => void;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  const removeTag = useCallback((id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  }, []);

  return (
    <TagsContext.Provider value={{ tags, setTags, removeTag }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTagsContext = () => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTagsContext must be used within a TagsProvider');
  }
  return context;
}; 