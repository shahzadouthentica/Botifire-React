import { useState, useEffect, useCallback } from 'react';
import { textbotApi, TextBotAgent } from '@/lib/api';
import { useWorkspace } from './useWorkspace';
import { useToast } from '@/hooks/use-toast';
import { SAMPLE_TEXT_BOTS } from '@/lib/samples';

export function useTextBots() {
    const { currentWorkspace } = useWorkspace();
    const [textbots, setTextbots] = useState<TextBotAgent[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchTextbots = useCallback(async () => {
        if (!currentWorkspace) {
            setTextbots(SAMPLE_TEXT_BOTS);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await textbotApi.list(currentWorkspace.id);

            if (response.success && response.data) {
                setTextbots([...SAMPLE_TEXT_BOTS, ...response.data]);
            } else {
                toast({
                    title: 'Error',
                    description: response.error || 'Failed to load text agents',
                    variant: 'destructive',
                });
                setTextbots([]);
            }
        } catch (error: any) {
            console.error('Error fetching textbots:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'An unexpected error occurred',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [currentWorkspace, toast]);

    useEffect(() => {
        fetchTextbots();
    }, [fetchTextbots]);

    const createTextbot = async (data: Partial<TextBotAgent>) => {
        if (!currentWorkspace) {
            return { error: new Error('No workspace selected') };
        }

        try {
            const response = await textbotApi.create({
                ...data,
                workspace_id: currentWorkspace.id,
            });

            if (response.success && response.data) {
                toast({
                    title: 'Success',
                    description: 'Text agent created successfully',
                });
                await fetchTextbots();
                return { data: response.data, error: null };
            } else {
                throw new Error(response.error || 'Failed to create text agent');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const updateTextbot = async (id: number | string, data: Partial<TextBotAgent>) => {
        try {
            const response = await textbotApi.update(id, data);

            if (response.success && response.data) {
                toast({
                    title: 'Success',
                    description: 'Text agent updated successfully',
                });
                await fetchTextbots();
                return { data: response.data, error: null };
            } else {
                throw new Error(response.error || 'Failed to update text agent');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const deleteTextbot = async (id: number | string) => {
        try {
            const response = await textbotApi.delete(id);

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Text agent deleted successfully',
                });
                await fetchTextbots();
                return { error: null };
            } else {
                throw new Error(response.error || 'Failed to delete text agent');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const startConversation = async (agentId: number | string, sessionId?: string) => {
        if (typeof agentId === 'string' && agentId.startsWith('sample-')) {
            return {
                data: {
                    id: 'sample-conv-' + Date.now(),
                    session_id: sessionId || 'sample-session',
                    messages: [
                        { id: 1, role: 'assistant', content: 'Hello! I am a sample assistant. How can I help you today?', created_at: new Date().toISOString() }
                    ]
                },
                error: null
            };
        }
        try {
            const response = await textbotApi.startConversation(agentId, sessionId);

            if (response.success && response.data) {
                return { data: response.data, error: null };
            } else {
                throw new Error(response.error || 'Failed to start conversation');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const chat = async (conversationId: number | string, message: string) => {
        if (typeof conversationId === 'string' && conversationId.startsWith('sample-conv-')) {
            return {
                data: {
                    id: Date.now(),
                    role: 'assistant',
                    content: `This is a sample response to: "${message}". In a live agent, this would be generated by AI.`,
                    created_at: new Date().toISOString()
                },
                error: null
            };
        }
        try {
            const response = await textbotApi.chat(conversationId, message);

            if (response.success && response.data) {
                return { data: response.data, error: null };
            } else {
                throw new Error(response.error || 'Failed to get response');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const attachKnowledge = async (textbotId: number | string, knowledgeBaseId: number | string) => {
        try {
            const response = await textbotApi.attachKnowledge(textbotId, knowledgeBaseId);

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Knowledge base attached',
                });
                return { error: null };
            } else {
                throw new Error(response.error || 'Failed to attach knowledge base');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const detachKnowledge = async (textbotId: number | string, knowledgeBaseId: number | string) => {
        try {
            const response = await textbotApi.detachKnowledge(textbotId, knowledgeBaseId);

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Knowledge base detached',
                });
                return { error: null };
            } else {
                throw new Error(response.error || 'Failed to detach knowledge base');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const listConversations = async (agentId: number | string, params?: { limit?: number; offset?: number }) => {
        try {
            const response = await textbotApi.listConversations(agentId, params);

            if (response.success && response.data) {
                return { data: response.data, error: null };
            } else {
                throw new Error(response.error || 'Failed to fetch conversations');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const getConversation = async (conversationId: number | string) => {
        try {
            const response = await textbotApi.getConversation(conversationId);

            if (response.success && response.data) {
                return { data: response.data, error: null };
            } else {
                throw new Error(response.error || 'Failed to fetch conversation');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const endConversation = async (conversationId: number | string) => {
        try {
            const response = await textbotApi.endConversation(conversationId);

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Conversation ended',
                });
                return { error: null };
            } else {
                throw new Error(response.error || 'Failed to end conversation');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const getEmbedCode = async (id: number | string) => {
        try {
            const response = await textbotApi.getEmbedCode(id);

            if (response.success && response.data) {
                return { data: response.data, error: null };
            } else {
                throw new Error(response.error || 'Failed to get embed code');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    return {
        textbots,
        loading,
        createTextbot,
        updateTextbot,
        deleteTextbot,
        startConversation,
        chat,
        attachKnowledge,
        detachKnowledge,
        listConversations,
        getConversation,
        endConversation,
        getEmbedCode,
        refetch: fetchTextbots,
    };
}
