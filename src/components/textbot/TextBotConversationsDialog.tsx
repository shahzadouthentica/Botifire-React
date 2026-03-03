import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTextBots } from '@/hooks/useTextBots';
import { TextBotAgent } from '@/lib/api';
import { Loader2, MessageSquare, Hash, DollarSign, ArrowLeft, User, Bot } from 'lucide-react';
import { format } from 'date-fns';

interface TextBotConversationsDialogProps {
    textbot: TextBotAgent | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TextBotConversationsDialog({ textbot, open, onOpenChange }: TextBotConversationsDialogProps) {
    const { listConversations, getConversation } = useTextBots();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        if (textbot && open) {
            loadConversations();
        } else {
            setConversations([]);
            setSelectedConversation(null);
            setMessages([]);
        }
    }, [textbot, open]);

    const loadConversations = async () => {
        if (!textbot) return;
        setLoading(true);
        try {
            const result = await listConversations(textbot.id, { limit: 50, offset: 0 });
            if (!result.error && result.data) {
                setConversations(Array.isArray(result.data.data) ? result.data.data : []);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadConversationMessages = async (conversationId: number) => {
        setLoadingMessages(true);
        try {
            const result = await getConversation(conversationId);
            if (result.data) {
                setSelectedConversation(result.data.conversation);
                setMessages(result.data.messages || []);
            }
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleConversationClick = (conv: any) => {
        loadConversationMessages(conv.id);
    };

    const handleBack = () => {
        setSelectedConversation(null);
        setMessages([]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {selectedConversation && (
                            <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <MessageSquare className="h-5 w-5" />
                        {selectedConversation ? 'Conversation Details' : `Conversations - ${textbot?.name}`}
                    </DialogTitle>
                </DialogHeader>

                {!selectedConversation ? (
                    <div className="flex-1 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                                <p className="text-sm text-muted-foreground">
                                    Conversations will appear here once users start chatting
                                </p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[500px] pr-4">
                                <div className="space-y-2">
                                    {conversations.map((conv) => (
                                        <div
                                            key={conv.id}
                                            onClick={() => handleConversationClick(conv)}
                                            className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={conv.status === 'active' ? 'default' : 'secondary'}>
                                                        {conv.status}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        ID: {conv.id}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(conv.started_at), 'MMM d, yyyy h:mm a')}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">Messages:</span>
                                                    <span className="font-medium">{conv.message_count || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">Tokens:</span>
                                                    <span className="font-medium">{conv.total_tokens || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">Cost:</span>
                                                    <span className="font-medium">${parseFloat(conv.cost || '0').toFixed(4)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="p-4 bg-muted/30 rounded-lg mb-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Messages</span>
                                    <p className="font-medium">{selectedConversation?.message_count || 0}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Tokens</span>
                                    <p className="font-medium">{selectedConversation?.total_tokens || 0}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Cost</span>
                                    <p className="font-medium">${parseFloat(selectedConversation?.cost || '0').toFixed(4)}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant={selectedConversation?.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                                        {selectedConversation?.status || 'unknown'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {loadingMessages ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <ScrollArea className="flex-1 pr-4">
                                <div className="space-y-4">
                                    {messages.filter(msg => msg.role !== 'system').map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {msg.role === 'assistant' && (
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Bot className="h-4 w-4 text-primary" />
                                                </div>
                                            )}
                                            <div
                                                className={`max-w-[70%] rounded-lg p-3 ${msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                                <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                                                    <span>{format(new Date(msg.created_at), 'h:mm a')}</span>
                                                    {msg.tokens && <span>• {msg.tokens} tokens</span>}
                                                </div>
                                            </div>
                                            {msg.role === 'user' && (
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
