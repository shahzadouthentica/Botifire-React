import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Play,
    Pause,
    RotateCcw,
    Volume2,
    Clock,
    Calendar,
    User,
    Bot,
    Smartphone,
    MapPin,
    Hash
} from 'lucide-react';
import { ConversationWithAgent } from '@/hooks/useConversations';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Slider } from '@/components/ui/slider';

interface VoiceConversationModalProps {
    conversation: ConversationWithAgent | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    audioUrl?: string;
}

export function VoiceConversationModal({ conversation, open, onOpenChange, audioUrl }: VoiceConversationModalProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!open) {
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    }, [open]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!conversation) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white border-border/40 rounded-3xl gap-0 shadow-2xl">
                <DialogHeader className="p-6 pb-0 sr-only">
                    <DialogTitle>Conversation Details</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col h-full">
                    {/* Top Section - Audio Player & Stats */}
                    <div className="p-6 bg-slate-50/50 border-b border-border/30">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">{conversation.agent?.name}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(conversation.started_at), 'MMM dd, h:mm a')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {conversation.duration_seconds}s
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-green-50 text-green-700 border-green-200 font-bold uppercase text-[10px]">
                                {conversation.status}
                            </Badge>
                        </div>

                        {/* Audio Controls */}
                        <div className="bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
                            <audio
                                ref={audioRef}
                                src={audioUrl}
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onEnded={() => setIsPlaying(false)}
                            />
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        size="icon"
                                        className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md active:scale-95 transition-all"
                                        onClick={togglePlay}
                                    >
                                        {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current translate-x-0.5" />}
                                    </Button>
                                    <div className="flex-1 space-y-1">
                                        <Slider
                                            value={[currentTime]}
                                            max={duration || 100}
                                            step={0.1}
                                            onValueChange={([val]) => {
                                                if (audioRef.current) audioRef.current.currentTime = val;
                                            }}
                                            className="cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-secondary">
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-2 px-3 h-9 bg-secondary/50 rounded-xl border border-border/20">
                                            <Volume2 className="h-4 w-4 text-muted-foreground" />
                                            <div className="w-16 h-1 bg-primary/20 rounded-full relative overflow-hidden">
                                                <div className="absolute inset-y-0 left-0 bg-primary w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section - Tabs */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <Tabs defaultValue="transcript" className="w-full h-full flex flex-col">
                            <div className="px-6 border-b border-border/30">
                                <TabsList className="bg-transparent h-14 p-0 gap-8 justify-start">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 h-full font-bold text-sm text-muted-foreground">
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="transcript" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 h-full font-bold text-sm text-muted-foreground">
                                        Transcription
                                    </TabsTrigger>
                                    <TabsTrigger value="client" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 h-full font-bold text-sm text-muted-foreground">
                                        Client Data
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-[400px]">
                                    <TabsContent value="overview" className="p-6 m-0 outline-none">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl border border-border/30 bg-secondary/10">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Session ID</p>
                                                <p className="text-sm font-bold font-mono">{conversation.session_id}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl border border-border/30 bg-secondary/10">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Status</p>
                                                <p className="text-sm font-bold capitalize">{conversation.status}</p>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="transcript" className="p-6 m-0 outline-none bg-slate-50/20">
                                        <div className="space-y-4">
                                            {conversation.transcript.map((msg, i) => (
                                                <div key={i} className={cn(
                                                    "flex gap-4 max-w-[85%]",
                                                    msg.role === 'assistant' || msg.role === 'agent' ? "mr-auto" : "ml-auto flex-row-reverse text-right"
                                                )}>
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center",
                                                        msg.role === 'assistant' || msg.role === 'agent' ? "bg-primary text-white" : "bg-secondary text-foreground"
                                                    )}>
                                                        {msg.role === 'assistant' || msg.role === 'agent' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                                    </div>
                                                    <div className={cn(
                                                        "p-4 rounded-2xl shadow-sm text-sm font-medium",
                                                        msg.role === 'assistant' || msg.role === 'agent'
                                                            ? "bg-white border border-border/40 rounded-tl-none"
                                                            : "bg-primary text-white rounded-tr-none"
                                                    )}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="client" className="p-6 m-0 outline-none">
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Available Information</h4>
                                            <div className="grid gap-3">
                                                {Object.entries(conversation.client_data || {}).map(([key, value]) => (
                                                    <div key={key} className="flex items-center justify-between p-3 bg-white border border-border/30 rounded-xl">
                                                        <div className="flex items-center gap-3">
                                                            {key === 'phone' ? <Smartphone className="h-4 w-4 text-primary" /> : <Hash className="h-4 w-4 text-primary" />}
                                                            <span className="text-xs font-bold text-muted-foreground capitalize">{key}</span>
                                                        </div>
                                                        <span className="text-xs font-bold text-foreground">{String(value)}</span>
                                                    </div>
                                                ))}
                                                {!conversation.client_data && (
                                                    <p className="text-sm font-medium text-muted-foreground italic">No client data captured for this session.</p>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </ScrollArea>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
