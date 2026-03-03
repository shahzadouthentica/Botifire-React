import { useState, useRef, useEffect } from 'react';
import { TextBotAgent, textbotApi } from '@/lib/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, Bot, User, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface TextBotChatDialogProps {
    textbot: TextBotAgent | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TextBotChatDialog({ textbot, open, onOpenChange }: TextBotChatDialogProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && textbot) {
            setMessages([]);
            setInput('');
            setConversationId(null);
            startConversation();
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open, textbot?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const startConversation = async () => {
        if (!textbot) return;

        try {
            const response = await textbotApi.startConversation(textbot.id);
            if (response.success && response.data) {
                setConversationId(response.data.conversation_id);
                if (response.data.first_message) {
                    setMessages([{ role: 'assistant', content: response.data.first_message }]);
                }
            }
        } catch (error) {
            console.error('Failed to start conversation:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !textbot || loading || !conversationId) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await textbotApi.chat(conversationId, userMessage);

            if (response.success && response.data) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data!.response }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.error || 'Sorry, I encountered an error. Please try again.'
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, something went wrong. Please try again.'
            }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = async () => {
        setMessages([]);
        setInput('');
        setConversationId(null);
        await startConversation();
        inputRef.current?.focus();
    };

    if (!textbot) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-base">{textbot.name}</DialogTitle>
                            <p className="text-xs text-muted-foreground">{textbot.model}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearChat}
                        className="h-8"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                </DialogHeader>

                <ScrollArea ref={scrollRef} className="flex-1 px-6 py-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                            <Bot className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-sm">Start a conversation with {textbot.name}</p>
                            <p className="text-xs mt-1">Type a message below to begin</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex gap-3",
                                        message.role === 'user' ? "flex-row-reverse" : ""
                                    )}
                                >
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarFallback className={cn(
                                            message.role === 'user'
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                                        )}>
                                            {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-2.5",
                                        message.role === 'user'
                                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                                            : "bg-muted rounded-tl-sm"
                                    )}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-3">
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>

                <div className="px-6 py-4 border-t bg-muted/30">
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            disabled={loading || !conversationId}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={loading || !input.trim() || !conversationId}
                            size="icon"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
