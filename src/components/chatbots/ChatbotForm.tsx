import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { ChatbotType } from './ChatbotCard';

const handlePhoneKeyDown = (e: any) => {
    const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
    ];

    if (allowedKeys.includes(e.key)) return;

    if (e.key === "+") {
        if (e.currentTarget.selectionStart !== 0 || e.currentTarget.value.includes("+")) {
            e.preventDefault();
        }
        return;
    }

    if (!/^\d$/.test(e.key)) {
        e.preventDefault();
    }
};

const chatbotSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    company_name: z.string().min(1, 'Company name is required'),
    website_url: z.string().url('Must be a valid URL'),
    industry: z.string().min(1, 'Industry is required'),
    primary_response_language: z.string().min(1, 'Primary response language is required'),
    response_style: z.string(),
    first_message: z.string().min(1, 'First message is required'),
    max_duration: z.number().min(60).max(3600),
    phone_number: z.string().optional().nullable(),
    whatsapp_number: z.string().optional().nullable(),
    email_address: z.string().email('Must be a valid email').optional().or(z.literal('')).nullable(),
    address: z.string().optional().nullable(),
    status: z.enum(['active', 'disabled', 'draft']),
});

type ChatbotFormData = z.infer<typeof chatbotSchema>;

interface ChatbotFormProps {
    initialData?: ChatbotType;
    onSubmit: (data: ChatbotFormData & {
        voice_id: string;
        voice_name: string;
        language: string;
    }) => Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
    isGenerating?: boolean;
    generatingProgress?: string;
}

const VOICES = [
    { id: '1', name: 'Sarah - Friendly & Professional' },
    { id: '2', name: 'Michael - Clear & Confident' },
    { id: '3', name: 'Emma - Empathetic & Warm' },
];

const INDUSTRIES = [
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'technology', name: 'Technology' },
    { id: 'education', name: 'Education' },
    { id: 'finance', name: 'Finance' },
    { id: 'other', name: 'Other' },
];

const LANGUAGES = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Spanish' },
    { id: 'ur', name: 'Urdu' },
];

export function ChatbotForm({ initialData, onSubmit, onCancel, isEditing, isGenerating, generatingProgress }: ChatbotFormProps) {
    const [loading, setLoading] = useState(false);

    const [selectedVoice, setSelectedVoice] = useState<{ id: string; name: string } | null>(
        initialData?.voice_name ? { id: 'custom', name: initialData.voice_name } : null
    );

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ChatbotFormData>({
        resolver: zodResolver(chatbotSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            first_message: initialData?.first_message || '',
            company_name: initialData?.company_name || '',
            website_url: initialData?.website_url || '',
            industry: initialData?.industry || '',
            primary_response_language: initialData?.primary_response_language || 'en',
            response_style: initialData?.response_style || 'friendly',
            max_duration: initialData?.max_duration || 300,
            phone_number: initialData?.phone_number || '',
            whatsapp_number: initialData?.whatsapp_number || '',
            email_address: initialData?.email_address || '',
            address: initialData?.address || '',
            status: initialData?.status || 'active',
        },
    });

    const [language, setLanguage] = useState<string>(initialData?.language || 'en');

    const handleFormSubmit = async (data: ChatbotFormData) => {
        if (!selectedVoice) {
            alert('Please select a voice for your bot');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                ...data,
                voice_id: selectedVoice.id,
                voice_name: selectedVoice.name,
                language: language,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 relative">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="name">Bot Name <span className="text-red-500">*</span></Label>
                            </div>
                            <Input
                                className="placeholder:text-muted-foreground/50"
                                id="name"
                                {...register('name')}
                                placeholder="e.g., Customer Support Bot"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="status">Status</Label>
                            </div>
                            <Select
                                value={watch('status')}
                                onValueChange={(value: 'active' | 'disabled' | 'draft') =>
                                    setValue('status', value, { shouldDirty: true })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="disabled">Disabled</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <Label htmlFor="description">Description</Label>
                        </div>
                        <Textarea
                            className="placeholder:text-muted-foreground/50 bg-muted/50 border-border/50 focus:bg-background"
                            id="description"
                            {...register('description')}
                            placeholder="Brief description of what this bot does"
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="company_name">Company Name <span className="text-red-500">*</span></Label>
                            </div>
                            <Input
                                className="placeholder:text-muted-foreground/50"
                                id="company_name"
                                {...register('company_name')}
                                placeholder="e.g., Acme Corp"
                            />
                            {errors.company_name && (
                                <p className="text-sm text-destructive">{errors.company_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="website_url">Website URL <span className="text-red-500">*</span></Label>
                            </div>
                            <Input
                                className="placeholder:text-muted-foreground/50"
                                id="website_url"
                                {...register('website_url')}
                                placeholder="e.g., https://www.acme.com"
                            />
                            {errors.website_url && (
                                <p className="text-sm text-destructive">{errors.website_url.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Industry</Label>
                            <Select
                                value={watch('industry')}
                                onValueChange={(value) => setValue('industry', value, { shouldDirty: true })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INDUSTRIES.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.industry && (
                                <p className="text-sm text-destructive">{errors.industry.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Primary Response Language</Label>
                            <Select
                                value={watch('primary_response_language')}
                                onValueChange={(value) => setValue('primary_response_language', value, { shouldDirty: true })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select
                                value={language}
                                onValueChange={setLanguage}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="System Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Response Style</Label>
                            <Select
                                value={watch('response_style')}
                                onValueChange={(value) => setValue('response_style', value, { shouldDirty: true })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="friendly">Friendly</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        {/* Phone Number */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="phone_number">Phone Number</Label>
                            </div>
                            <Input
                                id="phone_number"
                                type="tel"
                                inputMode="numeric"
                                placeholder="e.g., +923123456789"
                                {...register('phone_number')}
                                onKeyDown={handlePhoneKeyDown}
                            />
                        </div>

                        {/* WhatsApp Number */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                            </div>
                            <Input
                                id="whatsapp_number"
                                type="tel"
                                inputMode="numeric"
                                placeholder="e.g., +923123456789"
                                {...register('whatsapp_number')}
                                onKeyDown={handlePhoneKeyDown}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="email_address">Email Address</Label>
                            </div>
                            <Input
                                id="email_address"
                                type="email"
                                placeholder="e.g., support@example.com"
                                {...register('email_address')}
                            />
                            {errors.email_address && (
                                <p className="text-sm text-destructive">{errors.email_address.message}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="address">Address</Label>
                            </div>
                            <Input
                                id="address"
                                type="text"
                                placeholder="e.g., 123 Main Street, City, Country"
                                {...register('address')}
                            />
                        </div>
                    </div>

                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        Voice & Personality
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Voice</Label>
                        <Select
                            value={selectedVoice?.id || ""}
                            onValueChange={(val) => {
                                const voice = VOICES.find(v => v.id === val);
                                if (voice) setSelectedVoice(voice);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a voice preset" />
                            </SelectTrigger>
                            <SelectContent>
                                {VOICES.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <Label htmlFor="first_message">First Message <span className="text-red-500">*</span></Label>
                        </div>
                        <Textarea
                            id="first_message"
                            {...register('first_message')}
                            placeholder="Hello! How can I help you today?"
                            rows={2}
                            required
                        />
                        {errors.first_message && (
                            <p className="text-sm text-destructive">{errors.first_message.message}</p>
                        )}

                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <Label htmlFor="max_duration">Max Conversation Duration (seconds)</Label>
                        </div>
                        <Input
                            className="placeholder:text-muted-foreground/50"
                            id="max_duration"
                            type="number"
                            {...register('max_duration', { valueAsNumber: true })}
                            min={60}
                            max={3600}
                        />
                    </div>
                </CardContent>
            </Card>


            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" size="sm" className="rounded-2xl" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-2xl" disabled={loading || !watch('name').trim() || isGenerating}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'Update Bot' : 'Create Bot'}
                </Button>
            </div>

            {/* Progress Overlay */}
            {isGenerating && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[9999] flex items-center justify-center animate-in fade-in duration-500">
                    <div className="flex flex-col items-center gap-8 p-12 max-w-lg w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-700">
                        <div className="relative group">
                            {/* Outer Glow */}
                            <div className="absolute -inset-8 bg-primary/25 rounded-full blur-3xl animate-pulse group-hover:bg-primary/35 transition-colors duration-1000" />

                            {/* Spinning Ring */}
                            <div className="relative h-24 w-24 flex items-center justify-center">
                                <Loader2 className="absolute h-full w-full animate-[spin_1.5s_linear_infinite] text-primary" strokeWidth={1} />
                                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                            </div>

                            {/* Ping Effect */}
                            <div className="absolute inset-0 h-24 w-24 animate-ping text-primary/20 opacity-40">
                                <div className="h-full w-full rounded-full border-2 border-primary" />
                            </div>
                        </div>

                        <div className="text-center space-y-6 relative">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                                    {generatingProgress}
                                </h3>
                                <p className="text-muted-foreground font-medium text-lg">Optimizing your AI bot's personality...</p>
                            </div>

                            {/* Progress Container */}
                            <div className="relative w-80 h-4 bg-muted/30 rounded-full overflow-hidden border border-primary/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] p-0.5 backdrop-blur-sm">
                                <div
                                    className="h-full bg-gradient-to-r from-primary/80 via-primary to-primary/80 rounded-full animate-[progress-loading_2s_ease-in-out_infinite] shadow-[0_0_25px_hsl(var(--primary)/0.6)]"
                                />
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                                <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-bold ml-2">Processing</p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </form>
    );
}
