/**
 * Botifire - API Client
 * Complete REST API integration with JWT authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_BASE_URL_WITH_API = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

// Token management
let accessToken: string | null = localStorage.getItem('access_token');
let refreshToken: string | null = localStorage.getItem('refresh_token');

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    status?: number;
}

export interface User {
    id: number;
    email: string;
    full_name: string | null;
    avatar_url?: string | null;
    company_name: string | null;
    phone?: string | null;
    is_admin: number;
    created_at: string;
    updated_at?: string;
}

export interface Workspace {
    id: number;
    name: string;
    owner_id: number;
    role: 'admin' | 'member' | 'viewer';
    created_at?: string;
    updated_at?: string;
}

export interface Agent {
    id: number;
    workspace_id: number;
    public_id: string;
    name: string;
    description: string | null;
    language: string;
    voice_id: string | null;
    voice_name: string | null;
    system_prompt: string | null;
    first_message: string | null;
    response_style: string;
    company_name: string | null;
    website_url: string | null;
    industry: string | null;
    primary_response_language: string | null;
    max_duration: number;
    status: 'active' | 'disabled' | 'draft';
    elevenlabs_agent_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface TextBotAgent {
    id: number;
    workspace_id: number;
    name: string;
    description: string | null;
    model: string;
    system_prompt: string | null;
    first_message: string | null;
    language: string;
    temperature: number;
    max_tokens: number;
    status: 'active' | 'disabled' | 'draft';
    created_at: string;
    updated_at: string;
}

export interface UniversalPromptRequest {
    workspace_id?: string | null;
    company_name: string;
    website_url: string;
    language: string;
    industry: string;
    primary_response_language: string;
    response_style: string;
}

export interface UniversalPromptResponse {
    success: boolean;
    data: {
        system_prompt: string;
        business_analysis: string;
    };
}

export interface KnowledgeBase {
    id: number;
    workspace_id: number;
    name: string;
    description: string | null;
    knowledge_type: 'text' | 'pdf' | 'url' | 'faq' | 'csv' | 'doc' | 'docx';
    content: string | null;
    file_url: string | null;
    source_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Voice {
    voice_id: string;
    name: string;
    category: string;
    description: string;
    preview_url: string;
}

// Token helpers
export function setTokens(access: string, refresh: string) {
    accessToken = access;
    refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

export function isAuthenticated() {
    return !!accessToken;
}

// Core fetch function with auth
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL_WITH_API}${endpoint}`;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (accessToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });

        if (response.status === 401 && refreshToken) {
            // Refresh token logic would go here
        }

        const data = await response.json();
        return { ...data, status: response.status };
    } catch (error) {
        return { success: false, error: 'Network error', status: 500 };
    }
}

// ============================================
// AUTH API
// ============================================
export const authApi = {
    async register(email: string, password: string, fullName?: string): Promise<ApiResponse<{ user: User; access_token: string; refresh_token: string }>> {
        const result = await apiFetch<{ user: User; access_token: string; refresh_token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, full_name: fullName }),
        });
        if (result.success && result.data) setTokens(result.data.access_token, result.data.refresh_token);
        return result;
    },

    async login(email: string, password: string): Promise<ApiResponse<{ user: User; access_token: string; refresh_token: string }>> {
        const result = await apiFetch<{ user: User; access_token: string; refresh_token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (result.success && result.data) setTokens(result.data.access_token, result.data.refresh_token);
        return result;
    },

    async googleLogin(credential: string): Promise<ApiResponse<{ user: User; access_token: string; refresh_token: string }>> {
        const result = await apiFetch<{ user: User; access_token: string; refresh_token: string }>('/auth/google-login', {
            method: 'POST',
            body: JSON.stringify({ credential }),
        });
        if (result.success && result.data) setTokens(result.data.access_token, result.data.refresh_token);
        return result;
    },

    async logout(): Promise<ApiResponse<void>> {
        const result = await apiFetch<void>('/auth/logout', { method: 'POST' });
        clearTokens();
        return result;
    },

    async getMe(): Promise<ApiResponse<{ user: User; workspaces: Workspace[] }>> {
        return apiFetch<{ user: User; workspaces: Workspace[] }>('/auth/me');
    },

    async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
        return apiFetch<User>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
    },
};

// ============================================
// WORKSPACES API
// ============================================
export const workspacesApi = {
    async list(): Promise<ApiResponse<Workspace[]>> { return apiFetch<Workspace[]>('/workspaces'); },
    async create(name: string): Promise<ApiResponse<Workspace>> { return apiFetch<Workspace>('/workspaces', { method: 'POST', body: JSON.stringify({ name }) }); },
    async update(id: number | string, data: Partial<Workspace>): Promise<ApiResponse<Workspace>> { return apiFetch<Workspace>(`/workspaces/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id: number | string): Promise<ApiResponse<void>> { return apiFetch<void>(`/workspaces/${id}`, { method: 'DELETE' }); },
};

// ============================================
// AGENTS API (VoiceBots)
// ============================================
export const agentsApi = {
    async list(workspaceId?: number | string): Promise<ApiResponse<Agent[]>> { return apiFetch<Agent[]>(`/agents${workspaceId ? `?workspace_id=${workspaceId}` : ''}`); },
    async get(id: number | string): Promise<ApiResponse<Agent>> { return apiFetch<Agent>(`/agents/${id}`); },
    async create(data: Partial<Agent>): Promise<ApiResponse<Agent>> { return apiFetch<Agent>('/agents', { method: 'POST', body: JSON.stringify(data) }); },
    async update(id: number | string, data: Partial<Agent>): Promise<ApiResponse<Agent>> { return apiFetch<Agent>(`/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id: number | string): Promise<ApiResponse<void>> { return apiFetch<void>(`/agents/${id}`, { method: 'DELETE' }); },
    async deploy(id: number | string): Promise<ApiResponse<Agent>> { return apiFetch<Agent>(`/agents/${id}/deploy`, { method: 'POST' }); },
    async attachKnowledge(id: number | string, knowledgeBaseId: number | string): Promise<ApiResponse<void>> { return apiFetch<void>(`/agents/${id}/knowledge`, { method: 'POST', body: JSON.stringify({ knowledge_base_id: knowledgeBaseId }) }); },
    async detachKnowledge(id: number | string, knowledgeBaseId: number | string): Promise<ApiResponse<void>> { return apiFetch<void>(`/agents/${id}/knowledge/${knowledgeBaseId}`, { method: 'DELETE' }); },
    async getConversationToken(id: number | string): Promise<ApiResponse<{ token: string; agent_id: string }>> { return apiFetch(`/agents/${id}/conversation-token`); },
    async getSignedUrl(id: number | string): Promise<ApiResponse<{ signed_url: string; agent_id: string }>> { return apiFetch(`/agents/${id}/signed-url`); },
    async getEmbedCode(id: number | string): Promise<ApiResponse<{ public_id: string; embed_code: string }>> { return apiFetch(`/agents/${id}/embed-code`); },
    async generateVoicePrompt(data: UniversalPromptRequest): Promise<UniversalPromptResponse> { return apiFetch<UniversalPromptResponse['data']>('/prompts/voice/generate', { method: 'POST', body: JSON.stringify(data) }) as any; },
};

// ============================================
// TEXTBOT AGENTS API
// ============================================
export const textbotApi = {
    async list(workspaceId?: number | string): Promise<ApiResponse<TextBotAgent[]>> { return apiFetch<TextBotAgent[]>(`/textbot${workspaceId ? `?workspace_id=${workspaceId}` : ''}`); },
    async get(id: number | string): Promise<ApiResponse<TextBotAgent>> { return apiFetch<TextBotAgent>(`/textbot/${id}`); },
    async create(data: Partial<TextBotAgent>): Promise<ApiResponse<TextBotAgent>> { return apiFetch<TextBotAgent>('/textbot', { method: 'POST', body: JSON.stringify(data) }); },
    async update(id: number | string, data: Partial<TextBotAgent>): Promise<ApiResponse<TextBotAgent>> { return apiFetch<TextBotAgent>(`/textbot/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id: number | string): Promise<ApiResponse<void>> { return apiFetch<void>(`/textbot/${id}`, { method: 'DELETE' }); },
    async attachKnowledge(id: number | string, knowledgeBaseId: number | string): Promise<ApiResponse<void>> { return apiFetch<void>(`/textbot/${id}/knowledge`, { method: 'POST', body: JSON.stringify({ knowledge_base_id: knowledgeBaseId }) }); },
    async detachKnowledge(id: number | string, knowledgeBaseId: number | string): Promise<ApiResponse<void>> { return apiFetch<void>(`/textbot/${id}/knowledge/${knowledgeBaseId}`, { method: 'DELETE' }); },
    async getEmbedCode(id: number | string): Promise<ApiResponse<{ public_id: string; embed_code: string }>> { return apiFetch(`/textbot/${id}/embed-code`); },
    async generateUniversalPrompt(data: UniversalPromptRequest): Promise<UniversalPromptResponse> { return apiFetch<UniversalPromptResponse['data']>('/prompts/text/generate', { method: 'POST', body: JSON.stringify(data) }) as any; },
};

// ============================================
// KNOWLEDGE BASES API
// ============================================
export const knowledgeBasesApi = {
    async list(workspaceId?: number | string): Promise<ApiResponse<KnowledgeBase[]>> { return apiFetch<KnowledgeBase[]>(`/knowledge-bases${workspaceId ? `?workspace_id=${workspaceId}` : ''}`); },
    async get(id: number | string): Promise<ApiResponse<KnowledgeBase>> { return apiFetch<KnowledgeBase>(`/knowledge-bases/${id}`); },
    async create(data: Partial<KnowledgeBase>): Promise<ApiResponse<KnowledgeBase>> { return apiFetch<KnowledgeBase>('/knowledge-bases', { method: 'POST', body: JSON.stringify(data) }); },
    async update(id: number | string, data: Partial<KnowledgeBase>): Promise<ApiResponse<KnowledgeBase>> { return apiFetch<KnowledgeBase>(`/knowledge-bases/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id: number | string): Promise<ApiResponse<void>> { return apiFetch<void>(`/knowledge-bases/${id}`, { method: 'DELETE' }); },
    async deploy(id: number | string): Promise<ApiResponse<KnowledgeBase>> { return apiFetch<KnowledgeBase>(`/knowledge-bases/${id}/deploy`, { method: 'POST' }); },
    async uploadFile(workspaceId: number | string, name: string, file: File): Promise<ApiResponse<KnowledgeBase>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('workspace_id', String(workspaceId));
        return apiFetch<KnowledgeBase>('/knowledge-bases/upload', { method: 'POST', body: formData, headers: { 'Content-Type': 'multipart/form-data' } });
    },
};

// ============================================
// VOICES API
// ============================================
export const voicesApi = {
    async list(): Promise<ApiResponse<Voice[]>> { return apiFetch<Voice[]>('/voices'); },
};

export default {
    auth: authApi,
    workspaces: workspacesApi,
    agents: agentsApi,
    textbot: textbotApi,
    knowledgeBases: knowledgeBasesApi,
    voices: voicesApi,
};
