import { useState, useEffect } from 'react';
import { useWorkspace } from './useWorkspace';
import { useToast } from '@/hooks/use-toast';
import { Agent } from '@/lib/api';
import { SAMPLE_VOICE_AGENTS } from '@/lib/samples';

export interface TranscriptMessage {
    role: 'user' | 'assistant' | 'agent' | 'system';
    content: string;
    timestamp?: number;
}

export interface ConversationWithAgent {
    id: string;
    agent_id: string;
    agent?: Agent;
    session_id: string;
    started_at: string;
    ended_at?: string;
    duration_seconds?: number;
    status: 'completed' | 'active' | 'failed' | 'processing';
    transcript: TranscriptMessage[];
    recording_url?: string;
    client_data?: Record<string, any>;
}

const SAMPLE_VOICE_CONVERSATIONS: ConversationWithAgent[] = [
    {
        id: 'cv-1',
        agent_id: 'sample-1',
        agent: SAMPLE_VOICE_AGENTS[0],
        session_id: 'sess_123456',
        started_at: new Date(Date.now() - 3600000).toISOString(),
        duration_seconds: 145,
        status: 'completed',
        transcript: [
            { role: 'assistant', content: 'Hello! How can I help you today?' },
            { role: 'user', content: 'I want to know about your services.' },
            { role: 'assistant', content: 'We offer AI-powered voice and text solutions for businesses.' }
        ],
        recording_url: 'https://example.com/recording1.mp3',
        client_data: { phone: '+92 300 1234567', location: 'Karachi, Pakistan' }
    },
    {
        id: 'cv-2',
        agent_id: 'sample-4',
        agent: SAMPLE_VOICE_AGENTS[3],
        session_id: 'sess_789012',
        started_at: new Date(Date.now() - 86400000).toISOString(),
        duration_seconds: 45,
        status: 'completed',
        transcript: [
            { role: 'assistant', content: 'Meezan Bank support, how can I assist?' },
            { role: 'user', content: 'What is my account balance?' }
        ],
        client_data: { phone: '+92 321 7654321' }
    },
    {
        id: 'cv-3',
        agent_id: 'sample-1',
        agent: SAMPLE_VOICE_AGENTS[0],
        session_id: 'sess_pending',
        started_at: new Date().toISOString(),
        status: 'active',
        transcript: [{ role: 'assistant', content: 'Connecting you now...' }]
    }
];

export function useConversations() {
    const { currentWorkspace } = useWorkspace();
    const [conversations, setConversations] = useState<ConversationWithAgent[]>(SAMPLE_VOICE_CONVERSATIONS);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchConversations = async () => {
        setLoading(true);
        // Simulate fetch
        setTimeout(() => {
            setConversations(SAMPLE_VOICE_CONVERSATIONS);
            setLoading(false);
        }, 500);
    };

    const deleteConversation = async (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        toast({ title: 'Deleted', description: 'Conversation removed successfully.' });
        return { success: true };
    };

    const syncConversations = async (agentId?: string) => {
        toast({ title: 'Syncing', description: 'Fetching latest conversations...' });
        return { success: true, data: { synced_count: 5 } };
    };

    const getAudioUrl = (id: string) => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    const getTranscript = async (id: string) => {
        const conv = conversations.find(c => c.id === id);
        return { data: { transcript: conv?.transcript || [] }, error: null };
    };

    return {
        conversations,
        loading,
        deleteConversation,
        syncConversations,
        getAudioUrl,
        getTranscript,
        refetch: fetchConversations
    };
}
