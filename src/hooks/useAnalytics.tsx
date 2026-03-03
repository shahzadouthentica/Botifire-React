import { useState, useEffect, useCallback } from 'react';

export interface AnalyticsData {
    totalConversations: number;
    avgDuration: number;
    totalCost: number;
    totalCostUsd: number;
    activeAgents: number;
    totalMinutes: number;
    conversationsToday: number;
    conversationsThisWeek: number;
    conversationsThisMonth: number;
    costThisMonth: number;
    widgetStats: {
        totalWidgetConversations: number;
        widgetCost: number;
    };
    agentStats: any[];
    dailyStats: any[];
    serviceBreakdown: any[];
}

const SAMPLE_ANALYTICS: AnalyticsData = {
    totalConversations: 1248,
    avgDuration: 142,
    totalCost: 15420,
    totalCostUsd: 462.60,
    activeAgents: 5,
    totalMinutes: 2950,
    conversationsToday: 42,
    conversationsThisWeek: 285,
    conversationsThisMonth: 1120,
    costThisMonth: 12450,
    widgetStats: {
        totalWidgetConversations: 456,
        widgetCost: 1368,
    },
    agentStats: [
        { id: '1', name: 'Customer Support', type: 'voice', conversations: 450, totalCost: 6750, totalDuration: 1500, avgDuration: 180, status: 'active' },
        { id: '2', name: 'Sales Assistant', type: 'voice', conversations: 320, totalCost: 4800, totalDuration: 960, avgDuration: 160, status: 'active' },
        { id: '3', name: 'Zendesk Bot', type: 'text', conversations: 280, totalCost: 1400, total_tokens: 45000, status: 'active' },
        { id: '4', name: 'Appointment Setter', type: 'voice', conversations: 150, totalCost: 2250, totalDuration: 450, avgDuration: 150, status: 'paused' },
        { id: '5', name: 'Feedback Collector', type: 'text', conversations: 48, totalCost: 220, total_tokens: 8500, status: 'active' },
    ],
    dailyStats: Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return {
            date: d.toISOString(),
            conversations: Math.floor(Math.random() * 50) + 20,
            cost: Math.floor(Math.random() * 1000) + 200,
            duration: Math.floor(Math.random() * 5000) + 1000,
        };
    }),
    serviceBreakdown: [
        { service: 'Text AI', total_tokens: 125000, total_cost_usd: 12.50, total_requests: 850, total_credits: 1250 },
        { service: 'Voice AI', total_tokens: 850000, total_cost_usd: 255.00, total_requests: 620, total_credits: 8500 },
        { service: 'STT/TTS', total_tokens: 0, total_cost_usd: 195.10, total_requests: 1470, total_credits: 5670 },
    ]
};

export function useAnalytics(
    period: '7d' | '14d' | '30d' | '90d' = '90d',
    agentId?: string,
    textbotId?: string
) {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<AnalyticsData>(SAMPLE_ANALYTICS);

    const refetch = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 800);
    }, []);

    useEffect(() => {
        refetch();
    }, [period, agentId, textbotId, refetch]);

    return {
        analytics,
        loading,
        refetch
    };
}
