import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAgents } from '@/hooks/useAgents';
import { AgentForm } from '@/components/agents/AgentForm';
import { AgentCard, AddAgentCard } from '@/components/agents/AgentCard';
import { Agent } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Search, Bot, Loader2, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VoiceAgents() {
    const { agents, loading, createAgent, updateAgent, deleteAgent, refetch, deployAgent } = useAgents();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deployingId, setDeployingId] = useState<number | string | null>(null);
    const { toast } = useToast();

    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreate = async (data: any) => {
        const result = await createAgent(data);
        if (!result.error) {
            setShowCreateDialog(false);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!editingAgent) return;
        const result = await updateAgent(String(editingAgent.id), data);
        if (!result.error) {
            setEditingAgent(null);
        }
    };

    const handleDeploy = async (agent: Agent) => {
        setDeployingId(agent.id);
        try {
            await deployAgent(String(agent.id));
        } finally {
            setDeployingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Voice Agents</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage your AI voice agents</p>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
                        <Bot className="h-3 w-3 mr-1" />
                        {filteredAgents.length} Agents
                    </Badge>
                </div>

                <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search agents by name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 transition-all focus:ring-2 focus:ring-primary/20 border-border/50 bg-secondary"
                            />
                        </div>
                        <div className="flex items-center gap-3">
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
                            {(searchQuery || statusFilter !== 'all') && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                    className="btn-secondary h-9 text-xs font-bold"
                                >
                                    <X className="h-3.5 w-3.5 mr-1.5" /> Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AddAgentCard onClick={() => setShowCreateDialog(true)} />
                    {filteredAgents.map((agent) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            onEdit={setEditingAgent}
                            onDelete={(a) => deleteAgent(String(a.id))}
                            onDeploy={handleDeploy}
                            onTest={() => { }}
                            onEmbedCode={() => { }}
                            isDeploying={deployingId === agent.id}
                        />
                    ))}
                </div>
            )}

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Create Voice Agent</DialogTitle></DialogHeader>
                    <AgentForm onSubmit={handleCreate} onCancel={() => setShowCreateDialog(false)} />
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingAgent} onOpenChange={(open) => !open && setEditingAgent(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Edit Voice Agent</DialogTitle></DialogHeader>
                    {editingAgent && <AgentForm initialData={editingAgent} onSubmit={handleUpdate} onCancel={() => setEditingAgent(null)} isEditing />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
