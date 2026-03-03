import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Play, Pencil, Trash2, Rocket, RefreshCw, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export interface ChatbotType {
    id: string | number;
    name: string;
    description?: string;
    status: 'active' | 'disabled' | 'draft';
    created_at: string;
    voice_name?: string;
    elevenlabs_agent_id?: string | null;
    [key: string]: any;
}

interface ChatbotCardProps {
    agent: ChatbotType;
    onEdit: (agent: ChatbotType) => void;
    onDelete: (agent: ChatbotType) => void;
    onDeploy: (agent: ChatbotType) => void;
    onRedeploy?: (agent: ChatbotType) => void;
    onTest: (agent: ChatbotType) => void;
    // onDuplicate: (agent: ChatbotType) => void;
    isDeploying?: boolean;
}

const statusColors: Record<string, string> = {
    active: 'text-primary border-primary/30 bg-primary/5',
    disabled: 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400',
    draft: 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400',
};

// Mini chart component - shows a decorative usage pattern
function MiniChart({ isActive }: { isActive: boolean }) {
    const color = isActive ? 'stroke-primary/60' : 'stroke-muted-foreground/30';
    const fillColor = isActive ? 'fill-primary/10' : 'fill-muted/20';

    return (
        <svg
            viewBox="0 0 200 50"
            className="w-full h-12 mt-auto"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id={`gradient-${isActive ? 'active' : 'inactive'}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" className={isActive ? 'stop-color-primary/20' : 'stop-color-muted/10'} style={{ stopColor: isActive ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--muted) / 0.1)' }} />
                    <stop offset="100%" style={{ stopColor: 'transparent' }} />
                </linearGradient>
            </defs>
            <path
                d="M0,40 Q20,35 40,38 T80,30 T120,35 T160,25 T200,32 L200,50 L0,50 Z"
                className={fillColor}
                style={{ fill: `url(#gradient-${isActive ? 'active' : 'inactive'})` }}
            />
            <path
                d="M0,40 Q20,35 40,38 T80,30 T120,35 T160,25 T200,32"
                className={color}
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function ChatbotCard({
    agent,
    onEdit,
    onDelete,
    onDeploy,
    onRedeploy,
    onTest,
    isDeploying
}: ChatbotCardProps) {
    const isDeployed = !!agent.elevenlabs_agent_id;
    const isActive = agent.status === 'active';

    return (
        <Card className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 flex flex-col min-h-[220px]">
            {/* Header with title and menu */}
            <div className="p-3 pb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-base leading-tight truncate">
                        {agent.name}
                    </h3>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 flex-shrink-0 rounded-md hover:bg-accent/50 transition-all duration-150 hover:scale-105"
                        >
                            <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-32"
                    >
                        <DropdownMenuItem
                            onClick={() => onTest(agent)}
                            disabled={!isDeployed}
                            className="text-xs py-1.5"
                        >
                            <Play className="h-3 w-3 mr-2" />
                            Test
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => onEdit(agent)}
                            className="text-xs py-1.5"
                        >
                            <Pencil className="h-3 w-3 mr-2" />
                            Edit
                        </DropdownMenuItem>

                        {isDeployed ? (
                            <DropdownMenuItem
                                onClick={() => onRedeploy?.(agent)}
                                disabled={isDeploying}
                                className="text-xs py-1.5"
                            >
                                <RefreshCw className={`h-3 w-3 mr-2 ${isDeploying ? 'animate-spin' : ''}`} />
                                Republish
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onClick={() => onDeploy(agent)}
                                disabled={isDeploying}
                                className="text-xs py-1.5"
                            >
                                <Rocket className={`h-3 w-3 mr-2 ${isDeploying ? 'animate-spin' : ''}`} />
                                Publish
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={() => onDelete(agent)}
                            className="text-xs py-1.5 text-destructive focus:text-destructive"
                        >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Metadata */}
            <div className="px-4 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <span className="text-muted-foreground/70">Created:</span>
                    <span>{format(new Date(agent.created_at || new Date()), 'dd MMM yyyy')}</span>
                </div>
                {agent.voice_name && (
                    <div className="flex items-center gap-1">
                        <span className="text-muted-foreground/70">Voice:</span>
                        <span className="truncate">{agent.voice_name}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                    <span className="text-muted-foreground/70">Status:</span>
                    <Badge
                        variant="outline"
                        className={`text-[10px] h-4 uppercase ${statusColors[agent.status || 'draft']}`}
                    >
                        {agent.status || 'draft'}
                    </Badge>
                    {isDeployed ? (
                        <Badge
                            variant="outline"
                            className="text-[10px] h-4"
                        >
                            Published
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="text-[10px] h-4 bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400"
                        >
                            Unpublished
                        </Badge>
                    )}
                </div>
            </div>

            {/* Mini Chart */}
            <div className="mt-0 px-2">
                <MiniChart isActive={isActive} />
            </div>

            {/* Hover overlay with quick actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Card>
    );
}

// Add Chatbot Card Component
export function AddChatbotCard({ onClick }: { onClick: () => void }) {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-300",
                "shadow-md hover:shadow-lg hover:-translate-y-1",
                "border-2 border-dashed border-primary/30 hover:border-primary/50",
                "bg-gradient-to-br from-primary/5 to-primary/10"
            )}
            onClick={onClick}
        >
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[220px] p-6">
                <div className={cn(
                    "p-4 rounded-2xl bg-primary/10 transition-all duration-300",
                    "group-hover:scale-110 group-hover:bg-primary/20"
                )}>
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-lg text-foreground">
                    Add Bot
                </h3>
                <p className="mt-1 text-sm text-muted-foreground text-center">
                    Bot Creation & Setup
                </p>
            </CardContent>
        </Card>
    );
}
