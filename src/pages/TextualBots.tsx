import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useTextBots } from '@/hooks/useTextBots';
import { TextBotForm } from '@/components/textbot/TextBotForm';
import { TextBotCard, AddTextBotCard } from '@/components/textbot/TextBotCard';
import { TextBotChatDialog } from '@/components/textbot/TextBotChatDialog';
import { TextBotKnowledgeDialog } from '@/components/textbot/TextBotKnowledgeDialog';
import { TextBotConversationsDialog } from '@/components/textbot/TextBotConversationsDialog';
import { TextBotEmbedDialog } from '@/components/textbot/TextBotEmbedDialog';
import { Search, Bot, Loader2, MessageSquare, Filter, X, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TextBotAgent, textbotApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useNavigate } from 'react-router-dom';

export default function TextualBots() {
    const navigate = useNavigate();
    const { currentWorkspace } = useWorkspace();
    const { textbots, loading, createTextbot, updateTextbot, deleteTextbot, getEmbedCode, attachKnowledge, detachKnowledge } = useTextBots();
    const { toast } = useToast();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingBot, setEditingBot] = useState<TextBotAgent | null>(null);
    const [editingKnowledgeIds, setEditingKnowledgeIds] = useState<number[]>([]);
    const [testingBot, setTestingBot] = useState<TextBotAgent | null>(null);
    const [knowledgeBot, setKnowledgeBot] = useState<TextBotAgent | null>(null);
    const [conversationsBot, setConversationsBot] = useState<TextBotAgent | null>(null);
    const [embedBot, setEmbedBot] = useState<TextBotAgent | null>(null);
    const [embedCode, setEmbedCode] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<TextBotAgent | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
    const [promptProgress, setPromptProgress] = useState<string>('');

    const [statusFilter, setStatusFilter] = useState('all');
    const [modelFilter, setModelFilter] = useState('all');
    const [dateAfter, setDateAfter] = useState<Date | undefined>(undefined);
    const [dateBefore, setDateBefore] = useState<Date | undefined>(undefined);

    const filteredBots = (textbots || []).filter(bot => {
        const matchesSearch =
            bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bot.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const botDate = bot.created_at ? parseISO(bot.created_at) : null;
        const matchesDateAfter = !dateAfter || (botDate && isAfter(botDate, dateAfter));
        const matchesDateBefore = !dateBefore || (botDate && isBefore(botDate, dateBefore));

        const matchesStatus = statusFilter === 'all' || bot.status === statusFilter;
        const matchesModel = modelFilter === 'all' || bot.model === modelFilter;

        return matchesSearch && matchesDateAfter && matchesDateBefore && matchesStatus && matchesModel;
    });

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setModelFilter('all');
        setDateAfter(undefined);
        setDateBefore(undefined);
    };

    const uniqueModels = Array.from(new Set((textbots || []).map(b => b.model).filter(Boolean)));

    const handleCreate = async (data: Partial<TextBotAgent> & { knowledge_base_ids: (string | number)[] }) => {
        const { knowledge_base_ids, ...botData } = data;

        if (!currentWorkspace) {
            toast({
                title: 'Selection required',
                description: 'No workspace selected. Please select a workspace first.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsGeneratingPrompt(true);
            setPromptProgress('Analyzing your business...');

            const promptResponse = await textbotApi.generateUniversalPrompt({
                workspace_id: String(currentWorkspace.id),
                company_name: botData.company_name!,
                website_url: botData.website_url!,
                language: botData.language!,
                industry: botData.industry!,
                primary_response_language: botData.primary_response_language!,
                response_style: botData.response_style!,
            });

            if (!promptResponse.success) {
                throw new Error((promptResponse as any).error || 'Failed to generate prompt');
            }

            setPromptProgress('Generating optimized prompt...');

            const formatAnalysis = (analysis: any) => {
                if (!analysis || typeof analysis !== 'object') return String(analysis);
                return `
**Industry:** ${analysis.industry || 'N/A'}
**Services:** ${Array.isArray(analysis.services) ? analysis.services.join(', ') : analysis.services || 'N/A'}
**Technical Terms:** ${Array.isArray(analysis.technical_terms) ? analysis.technical_terms.join(', ') : analysis.technical_terms || 'N/A'}
**Processes:** ${Array.isArray(analysis.processes) ? analysis.processes.join(', ') : analysis.processes || 'N/A'}
**Pain Points:** ${Array.isArray(analysis.pain_points) ? analysis.pain_points.join(', ') : analysis.pain_points || 'N/A'}
**Target Audience:** ${analysis.target_audience || 'N/A'}
**Unique Value:** ${analysis.unique_value || 'N/A'}
        `.trim();
            };

            const mergedPrompt = `${promptResponse.data.system_prompt}\n\n---\n\n# Business Analysis\n\n${formatAnalysis(promptResponse.data.business_analysis)}`;

            setPromptProgress('Creating your agent...');
            const result = await createTextbot({
                ...botData,
                system_prompt: mergedPrompt,
            });

            if (!result.error && result.data) {
                setPromptProgress('Attaching knowledge bases...');
                for (const kbId of knowledge_base_ids) {
                    await attachKnowledge(result.data.id, kbId);
                }
                setShowCreateDialog(false);
            }
        } catch (error: any) {
            console.error('Error creating textbot:', error);
            toast({
                title: 'Error creating agent',
                description: error.message || 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsGeneratingPrompt(false);
            setPromptProgress('');
        }
    };

    const handleEdit = async (bot: TextBotAgent) => {
        try {
            const response = await textbotApi.get(bot.id);
            if (response.success && response.data) {
                const kbIds = ((response.data as any).knowledge_bases || []).map((kb: any) => Number(kb.id));
                setEditingKnowledgeIds(kbIds);
                setEditingBot(response.data);
            } else {
                setEditingKnowledgeIds([]);
                setEditingBot(bot);
            }
        } catch (err) {
            console.error('Error fetching textbot details:', err);
            setEditingKnowledgeIds([]);
            setEditingBot(bot);
        }
    };

    const handleUpdate = async (data: Partial<TextBotAgent> & { knowledge_base_ids: (string | number)[] }) => {
        if (!editingBot) return;
        const { knowledge_base_ids, ...botData } = data;
        const result = await updateTextbot(editingBot.id, botData);
        if (!result.error) {
            const currentIds = editingKnowledgeIds;
            const newIds = knowledge_base_ids.map(id => Number(id));

            const toDetach = currentIds.filter(id => !newIds.includes(id));
            for (const kbId of toDetach) {
                await detachKnowledge(editingBot.id, kbId);
            }

            const toAttach = newIds.filter(id => !currentIds.includes(id));
            for (const kbId of toAttach) {
                await attachKnowledge(editingBot.id, kbId);
            }

            setEditingBot(null);
            setEditingKnowledgeIds([]);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;
        setIsDeleting(true);
        try {
            await deleteTextbot(deleteConfirm.id);
            setDeleteConfirm(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicate = async (bot: TextBotAgent) => {
        await createTextbot({
            name: `${bot.name} (Copy)`,
            description: bot.description,
            model: bot.model,
            system_prompt: bot.system_prompt,
            temperature: bot.temperature,
            max_tokens: bot.max_tokens,
            language: bot.language,
            status: 'draft'
        });
    };

    const handleGetEmbedCode = async (bot: TextBotAgent) => {
        const result = await getEmbedCode(bot.id);
        if (result.data) {
            setEmbedCode(result.data.embed_code);
            setEmbedBot(bot);
        }
    };

    const handleViewConversations = (bot: TextBotAgent) => {
        setConversationsBot(bot);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Textual Bots</h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Create and manage your GPT-powered text agents
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {filteredBots.length} Agents
                            </Badge>
                        </div>
                    </div>

                    <Card className="overflow-hidden border-border/50 shadow-sm">
                        <CardContent className="p-4 space-y-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search text agents by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 transition-all focus:ring-2 focus:ring-primary/20 border-border/50 bg-muted/20"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                        <Filter className="h-3 w-3" />
                                        Filters:
                                    </span>
                                </div>

                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[140px] h-9 text-xs bg-secondary border-border/50 text-foreground">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border/50">
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={modelFilter} onValueChange={setModelFilter}>
                                    <SelectTrigger className="w-[140px] h-9 text-xs bg-secondary border-border/50 text-foreground">
                                        <Sparkles className="h-3 w-3 mr-1.5" />
                                        <SelectValue placeholder="Model" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border/50">
                                        <SelectItem value="all">All Models</SelectItem>
                                        {uniqueModels.map(model => (
                                            <SelectItem key={model} value={model}>{model}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="flex items-center gap-2">
                                    <DatePicker
                                        date={dateAfter}
                                        setDate={setDateAfter}
                                        placeholder="Created after"
                                        className="w-[145px] h-9 bg-secondary border-border/50"
                                    />
                                    <span className="text-muted-foreground text-xs font-semibold opacity-50 uppercase tracking-tighter">to</span>
                                    <DatePicker
                                        date={dateBefore}
                                        setDate={setDateBefore}
                                        placeholder="Created before"
                                        className="w-[145px] h-9 bg-secondary border-border/50"
                                    />
                                </div>

                                {(searchQuery || statusFilter !== 'all' || modelFilter !== 'all' || dateAfter || dateBefore) && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="btn-secondary h-9 text-xs font-bold gap-1.5"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading text agents...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <AddTextBotCard onClick={() => setShowCreateDialog(true)} />

                        {filteredBots.length === 0 && !searchQuery ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                                <div className={cn("inline-flex p-6 rounded-3xl mb-6 bg-primary/10 ring-1 ring-primary/20 text-primary")}>
                                    <Bot className="h-16 w-16" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    No text agents yet
                                </h3>
                                <p className="text-muted-foreground text-sm max-w-sm">
                                    Click the "Add Text Agent" card to create your first GPT-powered bot
                                </p>
                            </div>
                        ) : filteredBots.length === 0 && searchQuery ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                                <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    No results found
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Try a different search term
                                </p>
                            </div>
                        ) : (
                            filteredBots.map((bot) => (
                                <TextBotCard
                                    key={bot.id}
                                    textbot={bot}
                                    onEdit={handleEdit}
                                    onDelete={setDeleteConfirm}
                                    onTest={setTestingBot}
                                    onDuplicate={handleDuplicate}
                                    onManageKnowledge={setKnowledgeBot}
                                    onViewConversations={handleViewConversations}
                                    onGetEmbedCode={handleGetEmbedCode}
                                />
                            ))
                        )}
                    </div>
                )}

                <Dialog
                    open={showCreateDialog}
                    onOpenChange={(open) => {
                        if (!open && isGeneratingPrompt) return;
                        setShowCreateDialog(open);
                    }}
                >
                    <DialogContent className={cn("max-w-4xl max-h-[90vh] mx-4 sm:mx-auto", isGeneratingPrompt ? "overflow-hidden" : "overflow-y-auto")}>
                        <DialogHeader>
                            <DialogTitle>Create Text Agent</DialogTitle>
                        </DialogHeader>
                        <TextBotForm
                            onSubmit={handleCreate}
                            onCancel={() => setShowCreateDialog(false)}
                            isGenerating={isGeneratingPrompt}
                            generatingProgress={promptProgress}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={!!editingBot} onOpenChange={(open) => {
                    if (!open) {
                        setEditingBot(null);
                        setEditingKnowledgeIds([]);
                    }
                }}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Text Agent</DialogTitle>
                        </DialogHeader>
                        {editingBot && (
                            <TextBotForm
                                initialData={editingBot}
                                initialKnowledgeBaseIds={editingKnowledgeIds}
                                onSubmit={handleUpdate}
                                onCancel={() => {
                                    setEditingBot(null);
                                    setEditingKnowledgeIds([]);
                                }}
                                isEditing
                            />
                        )}
                    </DialogContent>
                </Dialog>

                <TextBotChatDialog
                    textbot={testingBot}
                    open={!!testingBot}
                    onOpenChange={(open) => !open && setTestingBot(null)}
                />

                <TextBotKnowledgeDialog
                    textbot={knowledgeBot}
                    open={!!knowledgeBot}
                    onOpenChange={(open) => !open && setKnowledgeBot(null)}
                />

                <TextBotEmbedDialog
                    textbot={embedBot}
                    embedCode={embedCode}
                    open={!!embedBot}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEmbedBot(null);
                            setEmbedCode(null);
                        }
                    }}
                />

                <TextBotConversationsDialog
                    textbot={conversationsBot}
                    open={!!conversationsBot}
                    onOpenChange={(open) => !open && setConversationsBot(null)}
                />

                <ConfirmationDialog
                    open={!!deleteConfirm}
                    onOpenChange={(open) => !open && setDeleteConfirm(null)}
                    title="Delete Text Agent"
                    description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    onConfirm={handleDeleteConfirm}
                    loading={isDeleting}
                    variant="destructive"
                />
            </div>
        </>
    );
}
