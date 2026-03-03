import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { workspacesApi, Workspace } from '@/lib/api';
import { useAuth } from './useAuth';

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  loading: boolean;
  refetch: () => Promise<void>;
  createWorkspace: (name: string) => Promise<{ data?: Workspace; error?: Error }>;
  updateWorkspace: (id: number | string, name: string) => Promise<{ data?: Workspace; error?: Error }>;
  deleteWorkspace: (id: number | string) => Promise<{ error?: Error }>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, workspaces: authWorkspaces } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    if (!user) {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setLoading(false);
      return;
    }

    try {
      const result = await workspacesApi.list();
      
      if (result.success && result.data) {
        setWorkspaces(result.data);
        
        // Set first workspace as current if none selected
        if (!currentWorkspace && result.data.length > 0) {
          // Try to restore from localStorage
          const savedWorkspaceId = localStorage.getItem('current_workspace_id');
          const savedWorkspace = result.data.find(w => String(w.id) === savedWorkspaceId);
          setCurrentWorkspace(savedWorkspace || result.data[0]);
        }
      } else if (authWorkspaces && authWorkspaces.length > 0) {
        // Use workspaces from login response as fallback
        setWorkspaces(authWorkspaces);
        if (!currentWorkspace) {
          const savedWorkspaceId = localStorage.getItem('current_workspace_id');
          const savedWorkspace = authWorkspaces.find(w => String(w.id) === savedWorkspaceId);
          setCurrentWorkspace(savedWorkspace || authWorkspaces[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      // Fallback to auth workspaces
      if (authWorkspaces && authWorkspaces.length > 0) {
        setWorkspaces(authWorkspaces);
        if (!currentWorkspace) {
          setCurrentWorkspace(authWorkspaces[0]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [user]);

  // Persist current workspace selection
  useEffect(() => {
    if (currentWorkspace) {
      localStorage.setItem('current_workspace_id', String(currentWorkspace.id));
    }
  }, [currentWorkspace]);

  const createWorkspace = async (name: string) => {
    try {
      const result = await workspacesApi.create(name);
      if (result.success && result.data) {
        await fetchWorkspaces();
        return { data: result.data };
      }
      return { error: new Error(result.error || 'Failed to create workspace') };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to create workspace') };
    }
  };

  const updateWorkspace = async (id: number | string, name: string) => {
    try {
      const result = await workspacesApi.update(id, { name });
      if (result.success && result.data) {
        await fetchWorkspaces();
        return { data: result.data };
      }
      return { error: new Error(result.error || 'Failed to update workspace') };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to update workspace') };
    }
  };

  const deleteWorkspace = async (id: number | string) => {
    try {
      const result = await workspacesApi.delete(id);
      if (result.success) {
        await fetchWorkspaces();
        return {};
      }
      return { error: new Error(result.error || 'Failed to delete workspace') };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to delete workspace') };
    }
  };

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      currentWorkspace,
      setCurrentWorkspace,
      loading,
      refetch: fetchWorkspaces,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
