import { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from './useWorkspace';
import { useToast } from '@/hooks/use-toast';
import { TextBotAgent } from '@/lib/api';
import { SAMPLE_TEXT_BOTS } from '@/lib/samples';

export interface TextBotMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
}

export interface TextBotConversation {
    id: string;
    agent_id: string;
    agent?: TextBotAgent;
    agent_name?: string;
    session_id: string;
    started_at: string;
    status: 'completed' | 'active' | 'failed' | 'ended';
    message_count: number;
    total_tokens: number;
    messages: TextBotMessage[];
}

const SAMPLE_TEXT_CONVERSATIONS: TextBotConversation[] = [
    {
        id: 'tcv-1',
        agent_id: 'sample-text-1',
        agent: SAMPLE_TEXT_BOTS[0],
        agent_name: 'Botifire Main',
        session_id: 'txt_sess_1',
        started_at: new Date(Date.now() - 7200000).toISOString(),
        status: 'completed',
        message_count: 8,
        total_tokens: 1240,
        messages: [
            { id: 'm1', role: 'user', content: 'What is your pricing?', created_at: new Date(Date.now() - 7100000).toISOString() },
            { id: 'm2', role: 'assistant', content: 'We have different plans starting from $19/mo.', created_at: new Date(Date.now() - 7000000).toISOString() }
        ]
    },
    {
        id: 'tcv-2',
        agent_id: 'sample-text-2',
        agent: SAMPLE_TEXT_BOTS[1],
        agent_name: 'Support Bot',
        session_id: 'txt_sess_2',
        started_at: new Date(Date.now() - 172800000).toISOString(),
        status: 'ended',
        message_count: 4,
        total_tokens: 540,
        messages: []
    }
];

export function useTextConversations(options: { enabled?: boolean } = {}) {
    const { enabled = true } = options;
    const { currentWorkspace } = useWorkspace();
    const [conversations, setConversations] = useState<TextBotConversation[]>(SAMPLE_TEXT_CONVERSATIONS);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchConversations = useCallback(async () => {
        if (!enabled) return;
        setLoading(true);
        setTimeout(() => {
            setConversations(SAMPLE_TEXT_CONVERSATIONS);
            setLoading(false);
        }, 500);
    }, [enabled]);

    const deleteConversation = async (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        toast({ title: 'Deleted', description: 'Text conversation removed.' });
        return { success: true };
    };

    const getConversationDetails = async (id: string) => {
        const conv = conversations.find(c => c.id === id);
        return { data: conv, error: null };
    };

    return {
        conversations,
        loading,
        refetch: fetchConversations,
        deleteConversation,
        getConversationDetails
    };
}
