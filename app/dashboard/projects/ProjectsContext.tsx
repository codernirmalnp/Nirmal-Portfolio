import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: any[];
  categories: any[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface ProjectsContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  removeProject: (id: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const removeProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects, setProjects, removeProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
}; 