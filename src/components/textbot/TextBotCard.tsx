import { TextBotAgent } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreVertical,
    Pencil,
    Trash2,
    MessageSquare,
    Bot,
    Cpu,
    Sparkles,
    Database,
    History,
    Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TextBotCardProps {
    textbot: TextBotAgent;
    onEdit: (textbot: TextBotAgent) => void;
    onDelete: (textbot: TextBotAgent) => void;
    onTest: (textbot: TextBotAgent) => void;
    onDuplicate: (textbot: TextBotAgent) => void;
    onManageKnowledge?: (textbot: TextBotAgent) => void;
    onViewConversations?: (textbot: TextBotAgent) => void;
    onGetEmbedCode?: (textbot: TextBotAgent) => void;
}

const languageName = new Intl.DisplayNames(['en'], {
    type: 'language',
});

export function TextBotCard({
    textbot,
    onEdit,
    onDelete,
    onTest,
    onDuplicate,
    onManageKnowledge,
    onViewConversations,
    onGetEmbedCode
}: TextBotCardProps) {
    const isSample = (textbot as any).is_sample;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-primary border-primary/30 bg-primary/5';
            case 'disabled':
                return 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400';
            default:
                return 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400';
        }
    };

    const getModelLabel = (model: string) => {
        if (model.includes('gpt-4')) return 'GPT-4';
        if (model.includes('gpt-3.5')) return 'GPT-3.5';
        return model.split('-')[0].toUpperCase();
    };

    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-300",
            "bg-card/80 backdrop-blur-sm border-border/50",
            isSample ? "border-accent/40 bg-accent/5 shadow-sm" : "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20"
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="relative pb-2 p-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm text-primary ring-1 ring-primary/20 group-hover:scale-105 transition-transform">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                                {textbot.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                {isSample && <Badge variant="secondary" className="text-[9px] h-3.5 bg-accent/20 text-black border-accent/20 font-bold uppercase tracking-wider">Template</Badge>}
                                <Badge variant="outline" className="text-[9px] h-3.5 px-0.5 bg-secondary/50 border-border/50">
                                    <Cpu className="h-2 w-2 mr-0.5 opacity-70" />
                                    {getModelLabel(textbot.model)}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={cn("text-[9px] h-3.5 uppercase font-bold px-1.5", getStatusColor(textbot.status))}>
                                    {textbot.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-secondary shrink-0">
                                <MoreVertical className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-popover/95 backdrop-blur-md border-border/50">
                            <DropdownMenuItem onClick={() => onTest(textbot)} className="text-xs py-1.5 cursor-pointer hover:bg-secondary">
                                <MessageSquare className="h-3 w-3 mr-2 text-primary" />
                                Test Chat
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(textbot)} className="text-xs py-1.5 cursor-pointer hover:bg-secondary">
                                <Pencil className="h-3 w-3 mr-2 text-primary" />
                                Edit Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            {onManageKnowledge && (
                                <DropdownMenuItem onClick={() => onManageKnowledge(textbot)} className="text-xs py-1.5 cursor-pointer hover:bg-secondary">
                                    <Database className="h-3 w-3 mr-2 text-primary" />
                                    Knowledge Base
                                </DropdownMenuItem>
                            )}
                            {onViewConversations && (
                                <DropdownMenuItem onClick={() => onViewConversations(textbot)} disabled={textbot.status !== 'active'} className="text-xs py-1.5 cursor-pointer hover:bg-secondary">
                                    <History className="h-3 w-3 mr-2 text-primary" />
                                    Conversations
                                </DropdownMenuItem>
                            )}
                            {onGetEmbedCode && (
                                <DropdownMenuItem onClick={() => onGetEmbedCode(textbot)} disabled={textbot.status !== 'active'} className="text-xs py-1.5 cursor-pointer hover:bg-secondary">
                                    <Code className="h-3 w-3 mr-2 text-primary" />
                                    Embed Options
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="bg-border/50" />
                            {!isSample ? (
                                <DropdownMenuItem
                                    onClick={() => onDelete(textbot)}
                                    className="text-xs py-1.5 text-destructive cursor-pointer hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Delete Agent
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem disabled className="text-xs py-1.5 text-muted-foreground opacity-50">
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Cannot delete sample
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="relative pt-0 p-3">
                <div className="space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <span className="opacity-60">Created:</span>
                        <span className="font-medium text-foreground/80">{format(new Date(textbot.created_at), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="opacity-60">Language:</span>
                        <span className="font-medium text-foreground/80">{textbot.language === 'en' ? 'English' : textbot.language}</span>
                    </div>
                    {(textbot.response_style || (textbot as any).tone) && (
                        <div className="flex items-center gap-1.5">
                            <span className="opacity-60">Tone:</span>
                            <span className="font-medium text-foreground/80 lowercase">{textbot.response_style || (textbot as any).tone}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
                    <div className="flex-1 text-[10px] text-muted-foreground/80 font-semibold space-x-2">
                        <span>Temp: {textbot.temperature?.toFixed(2) || '0.70'}</span>
                        <span className="opacity-30">•</span>
                        <span>Max: {textbot.max_tokens || '1024'}</span>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => onTest(textbot)}
                        disabled={textbot.status !== 'active'}
                        className="h-8 px-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all active:scale-95"
                    >
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                        Chat
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function AddTextBotCard({ onClick }: { onClick: () => void }) {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-300",
                "border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-secondary/30",
                "shadow-sm hover:shadow-md"
            )}
            onClick={onClick}
        >
            <CardContent className="flex flex-col items-center justify-center h-full p-6 min-h-[160px]">
                <div className={cn(
                    "p-4 rounded-2xl bg-primary/10 transition-all duration-300 shadow-sm ring-1 ring-primary/20",
                    "group-hover:scale-110 group-hover:shadow-primary/10"
                )}>
                    <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 font-bold text-lg text-foreground">
                    Add Text Agent
                </h3>
                <p className="mt-1 text-xs text-muted-foreground text-center font-medium">
                    Create & configure text agent
                </p>
            </CardContent>
        </Card>
    );
}
