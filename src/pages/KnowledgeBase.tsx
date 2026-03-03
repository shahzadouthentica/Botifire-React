import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useKnowledgeBases, KnowledgeBase } from '@/hooks/useKnowledgeBases';
import { KnowledgeBaseForm } from '@/components/knowledge/KnowledgeBaseForm';
import { KnowledgeBaseCard, AddKnowledgeCard } from '@/components/knowledge/KnowledgeBaseCard';
import { Search, Database, Loader2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function KnowledgeBase() {
    const [editingKB, setEditingKB] = useState<KnowledgeBase | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const {
        knowledgeBases,
        loading,
        createKnowledgeBase,
        updateKnowledgeBase,
        deleteKnowledgeBase,
        deployKnowledgeBase
    } = useKnowledgeBases();

    const filteredKBs = knowledgeBases.filter(kb => {
        const matchesSearch = kb.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || kb.knowledge_type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const typeCounts = knowledgeBases.reduce((acc, kb) => {
        acc[kb.knowledge_type] = (acc[kb.knowledge_type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const stats = [
        { title: 'Total KB', value: knowledgeBases.length },
        { title: 'Text', value: typeCounts.text || 0 },
        { title: 'PDF', value: typeCounts.pdf || 0 },
        { title: 'URL', value: typeCounts.url || 0 },
        { title: 'FAQ', value: typeCounts.faq || 0 },
        { title: 'Updated', value: 'Dec 21' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                        <Database className="h-7 w-7 text-primary" />
                        Knowledge Base
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Manage and organize your training content</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20 font-bold">
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        {knowledgeBases.length} Items
                    </Badge>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                {stats.map((stat, index) => (
                    <Card key={stat.title} className="bg-white border-border/40 shadow-sm hover:border-primary/20 transition-all group">
                        <CardContent className="p-3.5 flex flex-col justify-between h-full">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.title}</span>
                            <div className="text-2xl font-bold text-foreground mt-1 group-hover:text-primary transition-colors">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search and Filters */}
            <Card className="border-border/40 bg-white shadow-sm overflow-hidden">
                <CardContent className="p-4 sm:p-5 space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search knowledge bases..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-background border-border/50 focus:ring-primary/20 rounded-xl font-medium"
                        />
                    </div>
                    <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
                        <TabsList className="bg-secondary/30 p-1 h-auto flex-wrap rounded-xl gap-1">
                            {['all', 'text', 'pdf', 'url', 'faq'].map((filter) => (
                                <TabsTrigger
                                    key={filter}
                                    value={filter}
                                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-xs px-4 py-2 capitalize rounded-lg"
                                >
                                    {filter === 'all' ? 'All Types' : filter}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AddKnowledgeCard onClick={() => setShowCreateDialog(true)} />
                {filteredKBs.map((kb) => (
                    <KnowledgeBaseCard
                        key={kb.id}
                        kb={kb}
                        onEdit={(kb) => setEditingKB(kb)}
                        onView={() => { }}
                        onDelete={(id) => deleteKnowledgeBase(id)}
                        onDeploy={(id) => deployKnowledgeBase(id)}
                    />
                ))}
            </div>

            {/* Dialogs */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl bg-card border-border/50 p-6 rounded-3xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold">Add Knowledge</DialogTitle>
                        <DialogDescription className="font-medium">Upload content to train your agents</DialogDescription>
                    </DialogHeader>
                    <KnowledgeBaseForm
                        onSubmit={async (data) => {
                            await createKnowledgeBase(data);
                            setShowCreateDialog(false);
                        }}
                        onCancel={() => setShowCreateDialog(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingKB} onOpenChange={(open) => !open && setEditingKB(null)}>
                <DialogContent className="max-w-2xl bg-card border-border/50 p-6 rounded-3xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold">Edit Knowledge</DialogTitle>
                        <DialogDescription className="font-medium">Update your knowledge source details</DialogDescription>
                    </DialogHeader>
                    {editingKB && (
                        <KnowledgeBaseForm
                            initialData={editingKB}
                            onSubmit={async (data) => {
                                await updateKnowledgeBase(editingKB.id, data);
                                setEditingKB(null);
                            }}
                            onCancel={() => setEditingKB(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
