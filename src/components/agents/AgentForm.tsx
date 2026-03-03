import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { VoiceSelector } from './VoiceSelector';
import { KnowledgeBaseSelector } from '../selectors/KnowledgeBaseSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { LanguageSelector } from '../selectors/LanguageSelector';
import { ResponseStyleSelector } from '../selectors/ResponseStyleSelector';
import { PrimaryResponseLanguageSelector } from '../selectors/PrimaryResponseLanguageSelector';
import { IndustrySelector } from '../selectors/IndustrySelector';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { FirstMessageSuggestions } from '../selectors/first-message-suggestions';
import { Agent } from '@/lib/api';

const agentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    company_name: z.string().min(1, 'Company name is required'),
    website_url: z.string().url('Must be a valid URL'),
    industry: z.string().min(1, 'Industry is required'),
    primary_response_language: z.string().min(1, 'Primary response language is required'),
    response_style: z.string(),
    first_message: z.string().min(1, 'First message is required'),
    max_duration: z.number().min(60).max(3600),
    status: z.enum(['active', 'disabled', 'draft']),
});

type AgentFormData = z.infer<typeof agentSchema>;

interface AgentFormProps {
    initialData?: Agent;
    initialKnowledgeBaseIds?: (string | number)[];
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
}

export function AgentForm({ initialData, initialKnowledgeBaseIds = [], onSubmit, onCancel, isEditing }: AgentFormProps) {
    const [loading, setLoading] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState<{ id: string; name: string } | null>(
        initialData?.voice_id ? { id: initialData.voice_id, name: initialData.voice_name || '' } : null
    );

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AgentFormData>({
        resolver: zodResolver(agentSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            first_message: initialData?.first_message || '',
            company_name: initialData?.company_name || '',
            website_url: initialData?.website_url || '',
            industry: initialData?.industry || '',
            primary_response_language: initialData?.primary_response_language || 'bilingual_urdu_english',
            response_style: initialData?.response_style || 'friendly',
            max_duration: initialData?.max_duration || 300,
            status: initialData?.status || 'active',
        },
    });

    const [language, setLanguage] = useState<string>(initialData?.language || 'en');
    const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<(string | number)[]>(initialKnowledgeBaseIds);

    const handleFormSubmit = async (data: AgentFormData) => {
        setLoading(true);
        try {
            await onSubmit({
                ...data,
                voice_id: selectedVoice?.id,
                voice_name: selectedVoice?.name,
                language: language,
                knowledge_base_ids: selectedKnowledgeBases
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Agent Name *</Label>
                            <Input id="name" {...register('name')} placeholder="e.g., Customer Support Bot" />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={watch('status')} onValueChange={(v: any) => setValue('status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="disabled">Disabled</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register('description')} rows={2} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_name">Company Name *</Label>
                            <Input id="company_name" {...register('company_name')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website_url">Website URL *</Label>
                            <Input id="website_url" {...register('website_url')} />
                        </div>
                        <IndustrySelector value={watch('industry')} onChange={(v) => setValue('industry', v)} />
                        <PrimaryResponseLanguageSelector value={watch('primary_response_language')} onChange={(v) => setValue('primary_response_language', v)} />
                        <LanguageSelector value={language} onChange={setLanguage} />
                        <ResponseStyleSelector value={watch('response_style')} onChange={(v) => setValue('response_style', v)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Voice & Personality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <VoiceSelector value={selectedVoice?.id || null} onChange={setSelectedVoice} />
                    <div className="space-y-2">
                        <Label htmlFor="first_message">First Message *</Label>
                        <Textarea id="first_message" {...register('first_message')} rows={2} />
                        <FirstMessageSuggestions onSelect={(text) => setValue('first_message', text)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="max_duration">Max Duration (seconds)</Label>
                        <Input id="max_duration" type="number" {...register('max_duration', { valueAsNumber: true })} />
                    </div>
                </CardContent>
            </Card>

            <KnowledgeBaseSelector selectedIds={selectedKnowledgeBases} onChange={setSelectedKnowledgeBases} />

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="h-9 px-6 rounded-xl font-bold border-border/50 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-9 px-8 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'Save Changes' : 'Create Voice Agent'}
                </Button>
            </div>
        </form>
    );
}
