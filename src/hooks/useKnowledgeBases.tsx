import { useState, useEffect } from 'react';
import { useWorkspace } from './useWorkspace';
import { useToast } from '@/hooks/use-toast';
import { SAMPLE_KNOWLEDGE_BASES } from '@/lib/samples';

export interface KnowledgeBase {
    id: string;
    name: string;
    description?: string;
    knowledge_type: 'text' | 'pdf' | 'url' | 'faq';
    content?: string;
    source_url?: string;
    file_url?: string;
    status: 'active' | 'processing' | 'error';
    created_at: string;
    updated_at: string;
}

export function useKnowledgeBases() {
    const { currentWorkspace } = useWorkspace();
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(SAMPLE_KNOWLEDGE_BASES);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchKnowledgeBases = async () => {
        // No delay for static preview
        setKnowledgeBases(SAMPLE_KNOWLEDGE_BASES);
        setLoading(false);
    };

    useEffect(() => {
        if (currentWorkspace) {
            fetchKnowledgeBases();
        }
    }, [currentWorkspace]);

    const createKnowledgeBase = async (data: any) => {
        const newKB: KnowledgeBase = {
            id: `kb-${Date.now()}`,
            ...data,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        setKnowledgeBases(prev => [newKB, ...prev]);
        toast({
            title: "Success",
            description: "Knowledge base added successfully",
        });
        return { success: true };
    };

    const updateKnowledgeBase = async (id: string, updates: any) => {
        setKnowledgeBases(prev => prev.map(kb => kb.id === id ? { ...kb, ...updates, updated_at: new Date().toISOString() } : kb));
        toast({
            title: "Success",
            description: "Knowledge base updated successfully",
        });
        return { success: true };
    };

    const deleteKnowledgeBase = async (id: string) => {
        setKnowledgeBases(prev => prev.filter(kb => kb.id !== id));
        toast({
            title: "Success",
            description: "Knowledge base removed successfully",
        });
        return { success: true };
    };

    const deployKnowledgeBase = async (id: string) => {
        toast({
            title: "Success",
            description: "Knowledge base deployed successfully",
        });
        return { success: true };
    };

    const uploadFile = async (name: string, file: File) => {
        toast({
            title: "Success",
            description: "File uploaded and processing...",
        });
        return { success: true };
    };

    return {
        knowledgeBases,
        loading,
        createKnowledgeBase,
        updateKnowledgeBase,
        deleteKnowledgeBase,
        deployKnowledgeBase,
        uploadFile,
        refetch: fetchKnowledgeBases
    };
}
