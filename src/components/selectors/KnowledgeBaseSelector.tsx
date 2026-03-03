import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KnowledgeBaseForm } from '../knowledge/KnowledgeBaseForm';
import { FileText, Link, MessageSquare, Loader2, Plus, Database, BookOpen } from 'lucide-react';

interface KnowledgeBaseSelectorProps {
    selectedIds: (number | string)[];
    onChange: (ids: (number | string)[]) => void;
}

const typeIcons: Record<string, any> = {
    text: FileText,
    pdf: FileText,
    docx: FileText,
    doc: FileText,
    csv: FileText,
    url: Link,
    faq: MessageSquare,
};

export function KnowledgeBaseSelector({ selectedIds, onChange }: KnowledgeBaseSelectorProps) {
    const navigate = useNavigate();
    const { knowledgeBases, loading, createKnowledgeBase, refetch } = useKnowledgeBases();
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const handleToggle = (id: number | string, checked: boolean) => {
        if (checked) {
            onChange([...selectedIds, id]);
        } else {
            onChange(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    const handleCreateKB = async (data: any) => {
        const result = await createKnowledgeBase(data);
        if (!result.error && result.data) {
            onChange([...selectedIds, result.data.id]);
            setShowCreateDialog(false);
            await refetch();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            Knowledge Base
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCreateDialog(true)}
                                className="text-xs text-muted-foreground hover:text-primary"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Quick Add
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/knowledge')}
                                className="gap-1 rounded-2xl"
                            >
                                <Database className="h-3 w-3" />
                                Manage
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {knowledgeBases.length === 0 ? (
                        <div className="py-6 text-center text-muted-foreground">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No knowledge bases available</p>
                            <p className="text-sm">Click "Quick Add" to create one</p>
                        </div>
                    ) : (
                        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
                            {knowledgeBases.map((kb) => {
                                const Icon = typeIcons[kb.knowledge_type || 'text'] || FileText;
                                const kbId = String(kb.id);
                                return (
                                    <div
                                        key={kb.id}
                                        className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <Checkbox
                                            id={kbId}
                                            checked={selectedIds.some(id => String(id) === kbId)}
                                            onCheckedChange={(checked) => handleToggle(kb.id, checked === true)}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <Label
                                                htmlFor={kbId}
                                                className="flex items-center gap-2 cursor-pointer font-medium"
                                            >
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                                {kb.name}
                                            </Label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {selectedIds.length > 0 && (
                        <p className="text-xs text-muted-foreground pt-2 border-t">
                            {selectedIds.length} knowledge base{selectedIds.length > 1 ? 's' : ''} selected
                        </p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Knowledge Base</DialogTitle>
                    </DialogHeader>
                    <KnowledgeBaseForm
                        onSubmit={handleCreateKB}
                        onCancel={() => setShowCreateDialog(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
