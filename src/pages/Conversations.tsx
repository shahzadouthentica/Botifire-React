import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    MessageSquare,
    Bot,
    Sparkles,
    RefreshCw,
    Filter,
    X,
    Clock,
    Calendar,
    Loader2
} from 'lucide-react';
import { useConversations, ConversationWithAgent } from '@/hooks/useConversations';
import { useTextConversations, TextBotConversation } from '@/hooks/useTextConversations';
import { ConversationTable } from '@/components/conversations/ConversationTable';
import { VoiceConversationModal } from '@/components/conversations/VoiceConversationModal';
import { TextConversationModal } from '@/components/conversations/TextConversationModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Conversations() {
    const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');
    const {
        conversations: voiceConversations,
        loading: loadingVoice,
        deleteConversation: deleteVoice,
        getAudioUrl,
        refetch: refetchVoice,
        syncConversations
    } = useConversations();

    const {
        conversations: textConversations,
        loading: loadingText,
        deleteConversation: deleteText,
        refetch: refetchText
    } = useTextConversations({ enabled: true });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVoice, setSelectedVoice] = useState<ConversationWithAgent | null>(null);
    const [selectedText, setSelectedText] = useState<TextBotConversation | null>(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [durationFilter, setDurationFilter] = useState('all');

    const filteredVoice = voiceConversations.filter(c => {
        const matchesSearch = c.agent?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.session_id?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredText = textConversations.filter(c => {
        const matchesSearch = c.agent_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.session_id?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total Calls', value: voiceConversations.length, icon: MessageSquare },
        { label: 'Text Chats', value: textConversations.length, icon: Sparkles },
        { label: 'Duration', value: '12.4h', icon: Clock },
        { label: 'Avg Credits', value: '124', icon: Calendar },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                        <MessageSquare className="h-7 w-7 text-primary" />
                        Conversations
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Review interactions with your agents</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white rounded-xl font-bold text-xs gap-2 border-border/40 h-10 px-4 shadow-sm"
                        onClick={() => activeTab === 'voice' ? syncConversations() : refetchText()}
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Sync History
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-white border-border/40 shadow-sm overflow-hidden group">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
                                <p className="text-xl font-bold">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
                <TabsList className="bg-secondary/20 p-1.5 h-auto rounded-2xl gap-2 w-full sm:w-auto">
                    <TabsTrigger
                        value="voice"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-xs px-6 py-2.5 rounded-xl gap-2 transition-all"
                    >
                        <Bot className="h-4 w-4" />
                        Voice Bot History
                    </TabsTrigger>
                    <TabsTrigger
                        value="text"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-xs px-6 py-2.5 rounded-xl gap-2 transition-all"
                    >
                        <Sparkles className="h-4 w-4" />
                        Textual Bot History
                    </TabsTrigger>
                </TabsList>

                {/* Filters */}
                <Card className="mt-4 border-border/40 bg-white shadow-sm overflow-hidden mb-6">
                    <CardContent className="p-5 flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[280px]">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by agent name or session ID..."
                                className="pl-10 h-11 bg-slate-50 border-border/20 focus:ring-primary/20 rounded-xl font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px] h-11 bg-slate-50 border-border/20 rounded-xl font-bold text-xs">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                                    <SelectValue placeholder="Status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/40">
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="h-11 px-4 rounded-xl font-bold text-xs transition-colors hover:bg-secondary border border-transparent hover:border-border/30">
                                <Calendar className="h-4 w-4 mr-2" />
                                Select Date Range
                            </Button>
                            {(searchQuery || statusFilter !== 'all') && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-11 w-11 rounded-xl text-muted-foreground hover:text-destructive transition-colors"
                                    onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <TabsContent value="voice" className="m-0 focus:outline-none">
                    {loadingVoice ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white border border-border/40 rounded-3xl shadow-sm">
                            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                            <p className="mt-4 font-bold text-muted-foreground italic text-sm">Capturing Voice logs...</p>
                        </div>
                    ) : (
                        <ConversationTable
                            data={filteredVoice}
                            type="voice"
                            onView={setSelectedVoice}
                            onDelete={deleteVoice}
                        />
                    )}
                </TabsContent>

                <TabsContent value="text" className="m-0 focus:outline-none">
                    {loadingText ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white border border-border/40 rounded-3xl shadow-sm">
                            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                            <p className="mt-4 font-bold text-muted-foreground italic text-sm">Syncing Chat logs...</p>
                        </div>
                    ) : (
                        <ConversationTable
                            data={filteredText}
                            type="text"
                            onView={setSelectedText}
                            onDelete={deleteText}
                        />
                    )}
                </TabsContent>
            </Tabs>

            {/* Details Modals */}
            <VoiceConversationModal
                open={!!selectedVoice}
                onOpenChange={(open) => !open && setSelectedVoice(null)}
                conversation={selectedVoice}
                audioUrl={selectedVoice ? getAudioUrl(selectedVoice.id) : undefined}
            />

            <TextConversationModal
                open={!!selectedText}
                onOpenChange={(open) => !open && setSelectedText(null)}
                conversation={selectedText}
            />
        </div>
    );
}
