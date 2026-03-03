import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Calendar, Clock, MessageSquare, Hash, Zap } from 'lucide-react';
import { TextBotConversation } from '@/hooks/useTextConversations';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface TextConversationModalProps {
    conversation: TextBotConversation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TextConversationModal({ conversation, open, onOpenChange }: TextConversationModalProps) {
    if (!conversation) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[85vh] p-0 flex flex-col bg-white border-border/40 rounded-3xl gap-0 shadow-2xl">
                <DialogHeader className="p-6 border-b border-border/30 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold">{conversation.agent_name || 'Text Conversation'}</DialogTitle>
                                <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(conversation.started_at), 'MMM dd, yyyy')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        {conversation.message_count} Messages
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-primary/5 text-primary border-primary/30 font-bold uppercase text-[10px]">
                            {conversation.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden bg-white">
                    <ScrollArea className="h-full p-6">
                        <div className="space-y-6">
                            {conversation.messages?.length > 0 ? (
                                conversation.messages.map((msg) => (
                                    <div key={msg.id} className={cn(
                                        "flex gap-4 max-w-[85%]",
                                        msg.role === 'assistant' ? "mr-auto" : "ml-auto flex-row-reverse"
                                    )}>
                                        <div className={cn(
                                            "h-9 w-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm border",
                                            msg.role === 'assistant' ? "bg-white border-border/40 text-primary" : "bg-primary border-primary text-white"
                                        )}>
                                            {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                        </div>
                                        <div className="space-y-1.5 min-w-0">
                                            <div className={cn(
                                                "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                                                msg.role === 'assistant'
                                                    ? "bg-slate-50 border border-border/30 rounded-tl-none text-foreground"
                                                    : "bg-primary text-white rounded-tr-none"
                                            )}>
                                                {msg.content}
                                            </div>
                                            <p className={cn(
                                                "text-[9px] font-bold text-muted-foreground uppercase tracking-widest",
                                                msg.role === 'assistant' ? "text-left" : "text-right"
                                            )}>
                                                {format(new Date(msg.created_at), 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                    <MessageSquare className="h-12 w-12 mb-4" />
                                    <p className="font-bold text-sm">No message history available.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className="p-4 border-t border-border/30 bg-slate-50/30 flex justify-between items-center px-6">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Tokens</span>
                            <span className="text-xs font-bold">{conversation.total_tokens} tokens used</span>
                        </div>
                        <div className="h-6 w-px bg-border/40 mx-2" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">ID</span>
                            <span className="text-xs font-mono font-bold opacity-60 text-[10px]">{conversation.session_id}</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-white border-border/40 font-mono text-[10px] py-1 px-3">
                        TXT_{conversation.id.slice(0, 8)}
                    </Badge>
                </div>
            </DialogContent>
        </Dialog>
    );
}
