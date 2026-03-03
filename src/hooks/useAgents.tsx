import { useState, useEffect } from 'react';
import { agentsApi, Agent } from '@/lib/api';
import { useWorkspace } from './useWorkspace';
import { useToast } from '@/hooks/use-toast';
import { SAMPLE_VOICE_AGENTS } from '@/lib/samples';

export function useAgents() {
    const { currentWorkspace } = useWorkspace();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchAgents = async () => {
        if (!currentWorkspace) {
            setAgents(SAMPLE_VOICE_AGENTS);
            setLoading(false);
            return;
        }

        try {
            const result = await agentsApi.list(currentWorkspace.id);

            if (result.success && result.data) {
                setAgents([...SAMPLE_VOICE_AGENTS, ...result.data]);
            } else {
                toast({
                    title: 'Error fetching agents',
                    description: result.error || 'Failed to load agents',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error fetching agents',
                description: error instanceof Error ? error.message : 'An unexpected error occurred',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, [currentWorkspace]);

    const createAgent = async (agentData: Partial<Agent>) => {
        if (!currentWorkspace) return { error: new Error('No workspace selected') };

        try {
            const result = await agentsApi.create({
                ...agentData,
                workspace_id: currentWorkspace.id,
            });

            if (result.success && result.data) {
                toast({
                    title: 'Agent created',
                    description: `${agentData.name} has been created successfully.`,
                });
                await fetchAgents();
                return { data: result.data, error: null };
            }

            toast({
                title: 'Error creating agent',
                description: result.error || 'Failed to create agent',
                variant: 'destructive',
            });
            return { error: new Error(result.error || 'Failed to create agent') };
        } catch (error) {
            toast({
                title: 'Error creating agent',
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: 'destructive',
            });
            return { error: error instanceof Error ? error : new Error('Unknown error') };
        }
    };

    const updateAgent = async (id: string, updates: Partial<Agent>) => {
        try {
            const result = await agentsApi.update(id, updates);

            if (result.success && result.data) {
                toast({
                    title: 'Agent updated',
                    description: 'Your changes have been saved.',
                });
                await fetchAgents();
                return { data: result.data, error: null };
            }

            toast({
                title: 'Error updating agent',
                description: result.error || 'Failed to update agent',
                variant: 'destructive',
            });
            return { error: new Error(result.error || 'Failed to update agent') };
        } catch (error) {
            toast({
                title: 'Error updating agent',
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: 'destructive',
            });
            return { error: error instanceof Error ? error : new Error('Unknown error') };
        }
    };

    const deleteAgent = async (id: string) => {
        try {
            const result = await agentsApi.delete(id);

            if (result.success) {
                toast({
                    title: 'Agent deleted',
                    description: 'The agent has been removed.',
                });
                await fetchAgents();
                return { error: null };
            }

            toast({
                title: 'Error deleting agent',
                description: result.error || 'Failed to delete agent',
                variant: 'destructive',
            });
            return { error: new Error(result.error || 'Failed to delete agent') };
        } catch (error) {
            toast({
                title: 'Error deleting agent',
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: 'destructive',
            });
            return { error: error instanceof Error ? error : new Error('Unknown error') };
        }
    };

    const deployAgent = async (id: string) => {
        try {
            const result = await agentsApi.deploy(id);

            if (result.success && result.data) {
                toast({
                    title: 'Agent deployed',
                    description: 'Your agent is now live on ElevenLabs.',
                });
                await fetchAgents();
                return { data: result.data, error: null };
            }

            toast({
                title: 'Error deploying agent',
                description: result.error || 'Failed to deploy agent',
                variant: 'destructive',
            });
            return { error: new Error(result.error || 'Failed to deploy agent') };
        } catch (error) {
            toast({
                title: 'Error deploying agent',
                description: error instanceof Error ? error.message : 'An unexpected error occurred',
                variant: 'destructive',
            });
            return { error: error instanceof Error ? error : new Error('Unknown error') };
        }
    };

    const getConversationToken = async (id: string) => {
        if (id.startsWith('sample-')) {
            return { data: { token: 'sample-token' }, error: null };
        }
        try {
            const result = await agentsApi.getConversationToken(id);

            if (result.success && result.data) {
                return { data: result.data, error: null };
            }

            return { error: new Error(result.error || 'Failed to get conversation token') };
        } catch (error) {
            return { error: error instanceof Error ? error : new Error('Unknown error') };
        }
    };

    const getSignedUrl = async (id: string) => {
        if (id.startsWith('sample-')) {
            return { data: { url: 'https://elevenlabs.io/sample-voice' }, error: null };
        }
        try {
            const result = await agentsApi.getSignedUrl(id);

            if (result.success && result.data) {
                return { data: result.data, error: null };
            }

            return { error: new Error(result.error || 'Failed to get signed URL') };
        } catch (error) {
            return { error: error instanceof Error ? error : new Error('Unknown error') };
        }
    };

    return {
        agents,
        loading,
        createAgent,
        updateAgent,
        deleteAgent,
        deployAgent,
        getConversationToken,
        getSignedUrl,
        refetch: fetchAgents,
    };
}
