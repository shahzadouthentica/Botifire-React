import { Agent, TextBotAgent } from './api';

export const SAMPLE_VOICE_AGENTS: Agent[] = [
    {
        id: 'sample-1',
        name: 'texting',
        status: 'active',
        created_at: '2026-02-19T10:00:00Z',
        voice_id: 'sarah_pro',
        voice_name: 'Sarah - Mature, Reassuring, Confid...',
        model: 'gpt-4o-realtime',
        language: 'English',
        is_sample: true,
        elevenlabs_agent_id: null
    } as any,
    {
        id: 'sample-2',
        name: 'Pyari Walls',
        status: 'active',
        created_at: '2026-02-18T14:30:00Z',
        voice_id: 'monika_pro',
        voice_name: 'Monika Sogam - Hindi Modulated ...',
        model: 'gpt-4o-realtime',
        language: 'Hindi',
        is_sample: true,
        elevenlabs_agent_id: 'el-2'
    } as any,
    {
        id: 'sample-3',
        name: 'Botifre',
        status: 'active',
        created_at: '2026-02-18T09:15:00Z',
        voice_id: 'monika_pro',
        voice_name: 'Monika Sogam - Hindi Modulated ...',
        model: 'gpt-4o-realtime',
        language: 'Hindi',
        is_sample: true,
        elevenlabs_agent_id: 'el-3'
    } as any,
    {
        id: 'sample-4',
        name: 'Meezan Bank Pakistan',
        status: 'draft',
        created_at: '2025-12-31T23:59:59Z',
        voice_id: 'sarah_pro',
        voice_name: 'Sarah - Mature, Reassuring, Confid...',
        model: 'gpt-4o-realtime',
        language: 'English',
        is_sample: true,
        elevenlabs_agent_id: 'el-4'
    } as any,
    {
        id: 'sample-5',
        name: 'MCB Bank Pakistan Testin...',
        status: 'disabled',
        created_at: '2025-12-21T10:00:00Z',
        voice_id: 'monika_pro',
        voice_name: 'Monika Sogam - Hindi Modulated ...',
        model: 'gpt-4o-realtime',
        language: 'Hindi',
        is_sample: true,
        elevenlabs_agent_id: 'el-5'
    } as any,
    {
        id: 'sample-6',
        name: 'MCB Bank Pakistan Testin...',
        status: 'active',
        created_at: '2025-12-16T12:00:00Z',
        voice_id: 'sarah_pro',
        voice_name: 'Sarah - Mature, Reassuring, Confid...',
        model: 'gpt-4o-realtime',
        language: 'English',
        is_sample: true,
        elevenlabs_agent_id: 'el-6'
    } as any
];

export const SAMPLE_TEXT_BOTS: TextBotAgent[] = [
    {
        id: 'sample-text-1',
        name: 'Botifre',
        status: 'active',
        created_at: '2026-02-16T08:00:00Z',
        model: 'gpt-4',
        language: 'en',
        response_style: 'professional',
        temperature: 0.70,
        max_tokens: 1024,
        is_sample: true
    } as any,
    {
        id: 'sample-text-2',
        name: 'Botifire Bot',
        status: 'active',
        created_at: '2026-02-17T12:00:00Z',
        model: 'gpt-4',
        language: 'en',
        response_style: 'professional',
        temperature: 0.70,
        max_tokens: 1024,
        is_sample: true
    } as any,
    {
        id: 'sample-text-3',
        name: 'Texting perpose',
        status: 'draft',
        created_at: '2026-02-17T15:45:00Z',
        model: 'gpt-4',
        language: 'en',
        response_style: 'professional',
        temperature: 0.70,
        max_tokens: 1024,
        is_sample: true
    } as any,
    {
        id: 'sample-text-4',
        name: 'Support Assistant 3',
        status: 'active',
        created_at: '2026-02-04T09:00:00Z',
        model: 'gpt-4',
        language: 'en',
        response_style: 'friendly',
        temperature: 0.70,
        max_tokens: 500,
        is_sample: true
    } as any,
    {
        id: 'sample-text-5',
        name: 'Support Assistant 2',
        status: 'draft',
        created_at: '2026-02-04T10:30:00Z',
        model: 'gpt-4',
        language: 'en',
        response_style: 'friendly',
        temperature: 0.70,
        max_tokens: 500,
        is_sample: true
    } as any,
    {
        id: 'sample-text-6',
        name: 'Support Assistant',
        status: 'disabled',
        created_at: '2026-02-04T14:45:00Z',
        model: 'gpt-4',
        language: 'en',
        response_style: 'friendly',
        temperature: 0.70,
        max_tokens: 500,
        is_sample: true
    } as any
];

export const SAMPLE_KNOWLEDGE_BASES: any[] = [
    {
        id: 'kb-1',
        name: 'MCB Bank Pakistan Training',
        description: 'Customer service training data for MCB bank agents.',
        knowledge_type: 'text',
        content: 'This is a sample training content for MCB bank...',
        status: 'active',
        created_at: '2025-12-21T10:00:00Z',
        updated_at: '2025-12-21T10:00:00Z'
    },
    {
        id: 'kb-2',
        name: 'Product Manual V2',
        description: 'Comprehensive product documentation.',
        knowledge_type: 'pdf',
        file_url: 'sample.pdf',
        status: 'active',
        created_at: '2026-01-15T14:30:00Z',
        updated_at: '2026-01-15T14:30:00Z'
    },
    {
        id: 'kb-3',
        name: 'Company Wiki',
        description: 'Internal knowledge base.',
        knowledge_type: 'url',
        source_url: 'https://wiki.botifire.com',
        status: 'active',
        created_at: '2026-02-01T09:15:00Z',
        updated_at: '2026-02-01T09:15:00Z'
    },
    {
        id: 'kb-4',
        name: 'Support FAQ',
        description: 'Common questions and answers.',
        knowledge_type: 'faq',
        content: 'Q: How to reset? A: Go to settings.',
        status: 'active',
        created_at: '2026-02-20T11:45:00Z',
        updated_at: '2026-02-20T11:45:00Z'
    }
];
