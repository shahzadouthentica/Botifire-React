import { useState, useEffect } from 'react';
import { agentsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useAgentKnowledge(agentId?: string) {
    const [linkedKnowledgeBases, setLinkedKnowledgeBases] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchLinkedKnowledgeBases = async () => {
        if (!agentId) {
            setLinkedKnowledgeBases([]);
            return;
        }

        setLoading(true);
        try {
            const result = await agentsApi.get(agentId);
            if (result.success && result.data && (result.data as any).knowledge_bases) {
                const kbIds = (result.data as any).knowledge_bases.map((kb: any) => String(kb.id));
                setLinkedKnowledgeBases(kbIds);
            } else {
                setLinkedKnowledgeBases([]);
            }
        } catch (error) {
            console.error('Error fetching linked knowledge bases:', error);
            setLinkedKnowledgeBases([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinkedKnowledgeBases();
    }, [agentId]);

    const linkKnowledgeBase = async (knowledgeBaseId: string) => {
        if (!agentId) return { error: new Error('No agent selected') };

        try {
            const response = await agentsApi.attachKnowledge(agentId, knowledgeBaseId);

            if (response.success) {
                await fetchLinkedKnowledgeBases();
                return { error: null };
            } else {
                throw new Error(response.error || 'Failed to link knowledge base');
            }
        } catch (error: any) {
            toast({
                title: 'Error linking knowledge base',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const unlinkKnowledgeBase = async (knowledgeBaseId: string) => {
        if (!agentId) return { error: new Error('No agent selected') };

        try {
            const response = await agentsApi.detachKnowledge(agentId, knowledgeBaseId);

            if (response.success) {
                await fetchLinkedKnowledgeBases();
                return { error: null };
            } else {
                throw new Error(response.error || 'Failed to unlink knowledge base');
            }
        } catch (error: any) {
            toast({
                title: 'Error unlinking knowledge base',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    const updateLinkedKnowledgeBases = async (knowledgeBaseIds: string[]) => {
        if (!agentId) return { error: new Error('No agent selected') };

        try {
            // Remove all existing links first (by detaching each one)
            for (const kbId of linkedKnowledgeBases) {
                if (!knowledgeBaseIds.includes(kbId)) {
                    await agentsApi.detachKnowledge(agentId, kbId);
                }
            }

            // Add new links
            for (const kbId of knowledgeBaseIds) {
                if (!linkedKnowledgeBases.includes(kbId)) {
                    await agentsApi.attachKnowledge(agentId, kbId);
                }
            }

            toast({
                title: 'Knowledge bases updated',
                description: 'The agent knowledge sources have been updated.',
            });

            await fetchLinkedKnowledgeBases();
            return { error: null };
        } catch (error: any) {
            toast({
                title: 'Error updating knowledge bases',
                description: error.message,
                variant: 'destructive',
            });
            return { error };
        }
    };

    return {
        linkedKnowledgeBases,
        loading,
        linkKnowledgeBase,
        unlinkKnowledgeBase,
        updateLinkedKnowledgeBases,
        refetch: fetchLinkedKnowledgeBases,
    };
}
