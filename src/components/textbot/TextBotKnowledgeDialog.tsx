import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { useTextBots } from '@/hooks/useTextBots';
import { TextBotAgent, KnowledgeBase } from '@/lib/api';
import { Loader2, Plus, X, Database, FileText, Link as LinkIcon, BookOpen } from 'lucide-react';

interface TextBotKnowledgeDialogProps {
    textbot: TextBotAgent | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TextBotKnowledgeDialog({ textbot, open, onOpenChange }: TextBotKnowledgeDialogProps) {
    const { knowledgeBases, loading: kbLoading } = useKnowledgeBases();
    const { attachKnowledge, detachKnowledge, refetch } = useTextBots();
    const [attachedKbs, setAttachedKbs] = useState<KnowledgeBase[]>([]);
    const [attaching, setAttaching] = useState<number | null>(null);
    const [detaching, setDetaching] = useState<number | null>(null);

    useEffect(() => {
        if (textbot && open) {
            const attached = knowledgeBases.filter(kb =>
                (textbot as any).knowledge_bases?.some((tkb: any) => tkb.id === kb.id)
            );
            setAttachedKbs(attached);
        }
    }, [textbot, knowledgeBases, open]);

    const handleAttach = async (kb: KnowledgeBase) => {
        if (!textbot) return;
        setAttaching(kb.id);
        try {
            await attachKnowledge(textbot.id, kb.id);
            await refetch();
            setAttachedKbs([...attachedKbs, kb]);
        } finally {
            setAttaching(null);
        }
    };

    const handleDetach = async (kb: KnowledgeBase) => {
        if (!textbot) return;
        setDetaching(kb.id);
        try {
            await detachKnowledge(textbot.id, kb.id);
            await refetch();
            setAttachedKbs(attachedKbs.filter(k => k.id !== kb.id));
        } finally {
            setDetaching(null);
        }
    };

    const availableKbs = knowledgeBases.filter(
        kb => !attachedKbs.some(attached => attached.id === kb.id)
    );

    const getKbIcon = (type: string) => {
        switch (type) {
            case 'text':
            case 'docx':
            case 'doc':
            case 'csv':
                return FileText;
            case 'url':
                return LinkIcon;
            case 'pdf':
                return BookOpen;
            default:
                return Database;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Manage Knowledge Bases</DialogTitle>
                    <DialogDescription>
                        Attach knowledge bases to enhance {textbot?.name}'s responses
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Attached Knowledge ({attachedKbs.length})
                        </h3>
                        {attachedKbs.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
                                No knowledge bases attached yet
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {attachedKbs.map(kb => {
                                    const Icon = getKbIcon(kb.knowledge_type);
                                    return (
                                        <div
                                            key={kb.id}
                                            className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Icon className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{kb.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {kb.knowledge_type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDetach(kb)}
                                                disabled={detaching === kb.id}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                {detaching === kb.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <X className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Available Knowledge ({availableKbs.length})
                        </h3>
                        {kbLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : availableKbs.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
                                All knowledge bases are attached
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {availableKbs.map(kb => {
                                    const Icon = getKbIcon(kb.knowledge_type);
                                    return (
                                        <div
                                            key={kb.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="p-2 rounded-lg bg-muted">
                                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{kb.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {kb.knowledge_type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAttach(kb)}
                                                disabled={attaching === kb.id}
                                            >
                                                {attaching === kb.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Attach
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
