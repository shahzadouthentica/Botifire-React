import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi, User, Workspace, setTokens, isAuthenticated, clearTokens, ApiResponse } from '@/lib/api';

// Profile type for backward compatibility
export interface Profile {
    id: number;
    user_id: number;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    company_name: string | null;
    phone: string | null;
    is_admin: number;
    created_at: string;
    updated_at?: string;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null; // For backward compatibility
    workspaces: Workspace[];
    loading: boolean;
    isAdmin: boolean;
    signUp: (email: string, password: string, fullName?: string, companyName?: string, phone?: string) => Promise<ApiResponse<any>>;
    signIn: (email: string, password: string) => Promise<ApiResponse<any>>;
    signInWithGoogle: (credential: string) => Promise<ApiResponse<any>>;
    signOut: () => Promise<void>;
    refetchUser: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<ApiResponse<User>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = !!(user?.is_admin && Number(user.is_admin) === 1);

    const createProfileFromUser = (userData: User): Profile => ({
        id: userData.id,
        user_id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url || null,
        company_name: userData.company_name,
        phone: userData.phone || null,
        is_admin: userData.is_admin,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
    });

    const fetchUser = async () => {
        if (!isAuthenticated()) {
            setUser(null);
            setProfile(null);
            setWorkspaces([]);
            setLoading(false);
            return;
        }

        try {
            const result = await authApi.getMe();
            if (result.success && result.data) {
                const { user: userData, workspaces: workspaceData } = result.data;
                setUser(userData);
                setProfile(createProfileFromUser(userData));
                setWorkspaces(workspaceData || []);
            } else {
                clearTokens();
                setUser(null);
                setProfile(null);
                setWorkspaces([]);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            clearTokens();
            setUser(null);
            setProfile(null);
            setWorkspaces([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const signUp = async (email: string, password: string, fullName?: string, companyName?: string, phone?: string): Promise<ApiResponse<any>> => {
        try {
            const result = await authApi.register(email, password, fullName);

            if (result.success) {
                if (result.data && (result.data as any).access_token) {
                    const data = result.data as { user: User; workspaces?: Workspace[]; access_token: string; refresh_token: string };
                    setUser(data.user);
                    setProfile(createProfileFromUser(data.user));
                    setWorkspaces(data.workspaces || []);
                }
            }
            return result;
        } catch (error: any) {
            return { success: false, error: error?.message || 'Registration failed' };
        }
    };

    const signIn = async (email: string, password: string): Promise<ApiResponse<any>> => {
        try {
            const result = await authApi.login(email, password);

            if (result.success && result.data) {
                const data = result.data as { user: User; workspaces?: Workspace[]; access_token: string; refresh_token: string };
                setUser(data.user);
                setProfile(createProfileFromUser(data.user));
                setWorkspaces(data.workspaces || []);
            }
            return result;
        } catch (error: any) {
            return { success: false, error: error?.message || 'Login failed' };
        }
    };

    const signInWithGoogle = async (credential: string): Promise<ApiResponse<any>> => {
        try {
            const result = await authApi.googleLogin(credential);

            if (result.success && result.data) {
                const data = result.data as { user: User; workspaces?: Workspace[]; access_token: string; refresh_token: string };
                setUser(data.user);
                setProfile(createProfileFromUser(data.user));
                setWorkspaces(data.workspaces || []);
            }
            return result;
        } catch (error: any) {
            return { success: false, error: error?.message || 'Google login failed' };
        }
    };

    const updateProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
        try {
            const result = await authApi.updateProfile(data);
            if (result.success && result.data) {
                // Update both user and profile states
                const updatedUser = result.data;
                setUser(updatedUser);
                setProfile(createProfileFromUser(updatedUser));
            }
            return result;
        } catch (error: any) {
            return { success: false, error: error?.message || 'Profile update failed' };
        }
    };

    const signOut = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setProfile(null);
            setWorkspaces([]);
            clearTokens();
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            workspaces,
            loading,
            isAdmin,
            signUp,
            signIn,
            signInWithGoogle,
            signOut,
            refetchUser: fetchUser,
            updateProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
