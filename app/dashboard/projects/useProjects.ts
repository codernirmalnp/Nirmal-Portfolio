import { useCallback } from 'react';
import { useProjectsContext } from './ProjectsContext';

const PROJECTS_API_URL = '/api/projects';

export const useProjects = () => {
  const { projects, setProjects, removeProject } = useProjectsContext();

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(PROJECTS_API_URL);
      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to fetch projects: API error', res.status, text);
        setProjects([]);
        return;
      }
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Failed to fetch projects: Response is not JSON');
        setProjects([]);
        return;
      }
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
    }
  }, [setProjects]);

  // Delete a project by id
  const deleteProject = useCallback(async (id: string | number) => {
    try {
      const res = await fetch(`${PROJECTS_API_URL}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id) }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        removeProject(String(id));
        return { success: true };
      } else {
        return { success: false, error: data.dbDeleteError || "Failed to delete project." };
      }
    } catch (error) {
      return { success: false, error: "Failed to delete project." };
    }
  }, [removeProject]);

  // Create a new project
  const createProject = useCallback(async (data: any) => {
    try {
      const res = await fetch(PROJECTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        let error = 'Failed to create project';
        try {
          const errData = await res.json();
          error = errData.error || error;
        } catch {}
        return { success: false, error };
      }
      const project = await res.json();
      setProjects(prev => [...prev, project]);
      return { success: true, project };
    } catch (error) {
      return { success: false, error: "Failed to create project." };
    }
  }, [setProjects]);

  // Update an existing project
  const updateProject = useCallback(async (data: any) => {
    try {
      const res = await fetch(PROJECTS_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const project = await res.json();
      if (!res.ok || project.error) {
        return { success: false, error: project.error || "Failed to update project." };
      }
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
      return { success: true, project };
    } catch (error) {
      return { success: false, error: "Failed to update project." };
    }
  }, [setProjects]);

  // Add more methods (create, update) as needed

  return {
    projects,
    fetchProjects,
    deleteProject,
    createProject,
    updateProject,
    setProjects,
  };
}; 