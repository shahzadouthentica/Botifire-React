import { useState, useCallback, useEffect } from 'react';

export interface SubscriptionPlan {
    id: number;
    name: string;
    description: string;
    price: number;
    yearly_price: number;
    monthly_credits: number;
    features: string; // JSON string
}

export interface SubscriptionStatus {
    subscription_plan_id: number;
    status: string;
}

const SAMPLE_PLANS: SubscriptionPlan[] = [
    {
        id: 1,
        name: 'Free Trial',
        description: 'Get started with a 7-day free trial. Limited features and credits to explore the platform.',
        price: 0.00,
        yearly_price: 0.00,
        monthly_credits: 10000.00,
        features: JSON.stringify([
            { title: 'Voice Agents', value: 1, available: true },
            { title: 'Text Agents', value: 1, available: true },
            { title: 'Knowledge Bases', value: 2, available: true },
            { title: 'Monthly Credits', value: 100, available: true },
            { title: 'Conversations/month', value: 50, available: true },
        ])
    },
    {
        id: 2,
        name: 'Starter',
        description: 'Perfect for small teams or solo creators. More credits and priority support.',
        price: 29.99,
        yearly_price: 24.99,
        monthly_credits: 50000.00,
        features: JSON.stringify([
            { title: 'Voice Agents', value: 1, available: true },
            { title: 'Text Agents', value: 1, available: true },
            { title: 'Knowledge Bases', value: 2, available: true },
            { title: 'Monthly Credits', value: 100, available: true },
            { title: 'Conversations/month', value: 50, available: true },
        ])
    },
    {
        id: 3,
        name: 'Pro',
        description: 'For growing teams and businesses. Includes advanced analytics and higher volume.',
        price: 99.99,
        yearly_price: 79.99,
        monthly_credits: 150000.00,
        features: JSON.stringify([
            { title: 'Voice Agents', value: 1, available: true },
            { title: 'Text Agents', value: 1, available: true },
            { title: 'Knowledge Bases', value: 2, available: true },
            { title: 'Monthly Credits', value: 100, available: true },
            { title: 'Conversations/month', value: 50, available: true },
        ])
    },
    {
        id: 4,
        name: 'Enterprise',
        description: 'Custom solution for large teams or enterprises. Unlimited credits and premium support.',
        price: 0,
        yearly_price: 0,
        monthly_credits: 200000.00,
        features: JSON.stringify([
            { title: 'Voice Agents', value: 1, available: true },
            { title: 'Text Agents', value: 1, available: true },
            { title: 'Knowledge Bases', value: 2, available: true },
            { title: 'Monthly Credits', value: 100, available: true },
            { title: 'Conversations/month', value: 50, available: true },
        ])
    }
];

export function useSubscription() {
    const [plans] = useState<SubscriptionPlan[]>(SAMPLE_PLANS);
    const [status] = useState<SubscriptionStatus | null>({
        subscription_plan_id: 3, // Pro plan as current
        status: 'active'
    });
    const [loading] = useState(false);
    const [actionLoading] = useState(false);

    const subscribe = async (planId: number) => {
        console.log('Subscribing to plan:', planId);
        return { success: true };
    };

    const cancel = async () => {
        console.log('Cancelling subscription');
        return { success: true };
    };

    const refresh = async () => { };

    return {
        plans,
        status,
        loading,
        actionLoading,
        subscribe,
        cancel,
        refresh,
    };
}
