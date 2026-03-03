import { useState } from 'react';
import { createPortal } from 'react-dom';
import { TextBotAgent } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, Sparkles } from 'lucide-react';
import { KnowledgeBaseSelector } from '../selectors/KnowledgeBaseSelector';
import { IndustrySelector } from '../selectors/IndustrySelector';
import { ResponseStyleSelector } from '../selectors/ResponseStyleSelector';
import { PrimaryResponseLanguageSelector } from '../selectors/PrimaryResponseLanguageSelector';
import { LanguageSelector } from '../selectors/LanguageSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { FirstMessageSuggestions } from '../selectors/first-message-suggestions';

const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

interface TextBotFormProps {
    initialData?: TextBotAgent;
    initialKnowledgeBaseIds?: (string | number)[];
    onSubmit: (data: Partial<TextBotAgent> & { knowledge_base_ids: (string | number)[] }) => Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
    isGenerating?: boolean;
    generatingProgress?: string;
}

const GPT_MODELS = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Recommended)' },
];

export function TextBotForm({ initialData, initialKnowledgeBaseIds = [], onSubmit, onCancel, isEditing, isGenerating, generatingProgress }: TextBotFormProps) {
    const [loading, setLoading] = useState(false);
    const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<(string | number)[]>(initialKnowledgeBaseIds);
    const [language, setLanguage] = useState<string>(initialData?.language || 'en');
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        model: initialData?.model || 'gpt-4o-mini',
        system_prompt: initialData?.system_prompt || 'You are a helpful AI assistant. Be concise and helpful in your responses.',
        first_message: initialData?.first_message || '',
        temperature: Number(initialData?.temperature) || 0.7,
        max_tokens: Number(initialData?.max_tokens) || 1024,
        company_name: initialData?.company_name || '',
        website_url: initialData?.website_url || '',
        industry: initialData?.industry || '',
        primary_response_language: initialData?.primary_response_language || 'bilingual_urdu_english',
        response_style: initialData?.response_style || 'professional',
        status: initialData?.status || 'active',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                language,
                knowledge_base_ids: selectedKnowledgeBases
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative">
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
                                <Label htmlFor="name">Agent Name <span className="text-red-500">*</span></Label>
                                <InfoTooltip message="The display name for your AI agent." />
                            </div>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Customer Support Bot"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="status">Status</Label>
                                <InfoTooltip message="Active agents can be chatted with, while Draft and Disabled agents are offline." />
                            </div>
                            <Select
                                value={formData.status}
                                onValueChange={(value: 'active' | 'disabled' | 'draft') =>
                                    setFormData({ ...formData, status: value })
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
                            <InfoTooltip message="A brief internal note about this agent's purpose." />
                        </div>
                        <Textarea
                            className="placeholder:text-muted-foreground/50 dark:placeholder:text-muted-foreground/40 bg-muted/50 border-border/50 focus:bg-background"
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of what this agent does"
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="company_name">Company Name <span className="text-red-500">*</span></Label>
                                <InfoTooltip message="Specify the company name this agent represents." />
                            </div>
                            <Input
                                id="company_name"
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                placeholder="e.g., Acme Corp"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="website_url">Website URL <span className="text-red-500">*</span></Label>
                                <InfoTooltip message="The website URL for this business." />
                            </div>
                            <Input
                                id="website_url"
                                type="url"
                                value={formData.website_url}
                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                placeholder="https://example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <IndustrySelector
                                value={formData.industry}
                                onChange={(val) => setFormData({ ...formData, industry: val })}
                            />
                        </div>

                        <div className="space-y-2">
                            <PrimaryResponseLanguageSelector
                                value={formData.primary_response_language}
                                onChange={(val) => setFormData({ ...formData, primary_response_language: val })}
                            />
                        </div>

                        <div className="space-y-2">
                            <LanguageSelector
                                value={language}
                                onChange={setLanguage}
                            />
                        </div>

                        <div className="space-y-2">
                            <ResponseStyleSelector
                                value={formData.response_style}
                                onChange={(val) => setFormData({ ...formData, response_style: val })}
                            />
                        </div>
                    </div>

                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                        Configuration & Behavior
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <Label htmlFor="first_message">First Message <span className="text-red-500">*</span></Label>
                            <InfoTooltip message="This is the very first message your AI will send when a user starts a conversation." />
                        </div>
                        <Textarea
                            id="first_message"
                            value={formData.first_message}
                            onChange={(e) => setFormData({ ...formData, first_message: e.target.value })}
                            placeholder="Hello! How can I help you today?"
                            rows={2}
                            required
                        />
                        <FirstMessageSuggestions onSelect={(text) => setFormData({ ...formData, first_message: text })} />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-medium text-foreground">Model Configuration</h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <Label htmlFor="model">GPT Model</Label>
                                    <InfoTooltip message="Select the underlying AI model. GPT-4o Mini is faster and cheaper, while GPT-4o is more intelligent." />
                                </div>
                                <Select
                                    value={formData.model}
                                    onValueChange={(value) => setFormData({ ...formData, model: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GPT_MODELS.map((model) => (
                                            <SelectItem key={model.value} value={model.value}>
                                                {model.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Label>Temperature: {(Number(formData.temperature) || 0).toFixed(1)}</Label>
                                    <InfoTooltip message="Higher values make the output more random and creative, while lower values make it more focused and deterministic." />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {formData.temperature < 0.3 ? 'More focused' : formData.temperature > 0.7 ? 'More creative' : 'Balanced'}
                                </span>
                            </div>
                            <Slider
                                value={[formData.temperature]}
                                onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                                min={0}
                                max={1}
                                step={0.1}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Label>Max Tokens: {formData.max_tokens}</Label>
                                    <InfoTooltip message="The maximum length of the AI's response in tokens (roughly words)." />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    ~{Math.round(formData.max_tokens * 0.75)} words max
                                </span>
                            </div>
                            <Slider
                                value={[formData.max_tokens]}
                                onValueChange={([value]) => setFormData({ ...formData, max_tokens: value })}
                                min={256}
                                max={4096}
                                step={128}
                                className="w-full"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <KnowledgeBaseSelector
                selectedIds={selectedKnowledgeBases}
                onChange={setSelectedKnowledgeBases}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
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
                    disabled={loading || !formData.name.trim() || isGenerating}
                    className="h-9 px-8 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
                >
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isEditing ? 'Save Changes' : 'Create Text Agent'}
                </Button>
            </div>

            {/* Progress Overlay */}
            {isGenerating && createPortal(
                <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[9999] flex items-center justify-center animate-in fade-in duration-500">
                    <div className="flex flex-col items-center gap-8 p-12 max-w-lg w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-700">
                        <div className="relative group">
                            <div className="absolute -inset-8 bg-primary/25 rounded-full blur-3xl animate-pulse group-hover:bg-primary/35 transition-colors duration-1000" />
                            <div className="relative h-24 w-24 flex items-center justify-center">
                                <Loader2 className="absolute h-full w-full animate-[spin_1.5s_linear_infinite] text-primary" strokeWidth={1} />
                                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                            </div>
                            <div className="absolute inset-0 h-24 w-24 animate-ping text-primary/20 opacity-40">
                                <div className="h-full w-full rounded-full border-2 border-primary" />
                            </div>
                        </div>

                        <div className="text-center space-y-6 relative">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">
                                    {generatingProgress}
                                </h3>
                                <p className="text-muted-foreground font-medium text-lg">Optimizing your AI agent's personality...</p>
                            </div>

                            <div className="relative w-80 h-4 bg-muted/30 rounded-full overflow-hidden border border-primary/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] p-0.5 backdrop-blur-sm">
                                <div
                                    className="h-full bg-gradient-to-r from-primary/80 via-primary to-primary/80 rounded-full animate-progress-loading shadow-[0_0_25px_hsl(var(--primary)/0.6)]"
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
