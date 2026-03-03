import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Play, Pencil, Trash2, Rocket, RefreshCw, Sparkles, Code } from 'lucide-react';
import { format } from 'date-fns';
import { Agent } from '@/lib/api';

interface AgentCardProps {
    agent: Agent;
    onEdit: (agent: Agent) => void;
    onDelete: (agent: Agent) => void;
    onDeploy: (agent: Agent) => void;
    onTest: (agent: Agent) => void;
    onEmbedCode: (agent: Agent) => void;
    isDeploying?: boolean;
}

const statusColors: Record<string, string> = {
    active: 'text-primary border-primary/30 bg-primary/5',
    disabled: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
    draft: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
};

// Mini chart component - shows a decorative usage pattern
function MiniChart({ isActive }: { isActive: boolean }) {
    const color = isActive ? 'stroke-primary/60' : 'stroke-muted-foreground/30';
    const fillGradientId = `chart-gradient-${isActive ? 'active' : 'inactive'}`;

    return (
        <svg viewBox="0 0 200 50" className="w-full h-12 mt-auto" preserveAspectRatio="none">
            <defs>
                <linearGradient id={fillGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: isActive ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--muted) / 0.1)' }} />
                    <stop offset="100%" style={{ stopColor: 'transparent' }} />
                </linearGradient>
            </defs>
            <path d="M0,40 Q20,35 40,38 T80,30 T120,35 T160,25 T200,32 L200,50 L0,50 Z" fill={`url(#${fillGradientId})`} />
            <path d="M0,40 Q20,35 40,38 T80,30 T120,35 T160,25 T200,32" className={color} fill="none" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export function AgentCard({ agent, onEdit, onDelete, onDeploy, onTest, onEmbedCode, isDeploying }: AgentCardProps) {
    const isDeployed = !!agent.elevenlabs_agent_id;
    const isSample = (agent as any).is_sample;
    const isActive = agent.status === 'active';

    return (
        <Card className={cn(
            "group relative overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 transition-all duration-300 flex flex-col min-h-[140px]",
            isSample ? "border-accent/40 bg-accent/5" : "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
        )}>
            <div className="p-4 pb-0 flex items-start justify-between gap-2 mb-1">
                <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-base truncate">{agent.name}</h3>
                    {isSample && <Badge variant="secondary" className="w-fit text-[10px] h-4 bg-accent/20 text-black border-accent/30 font-bold uppercase tracking-wider">Template</Badge>}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-secondary"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-md border-border/50">
                        <DropdownMenuItem onClick={() => onTest(agent)} className="cursor-pointer hover:bg-secondary">
                            <Play className="h-3 w-3 mr-2 text-primary" /> Test Call
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(agent)} className="cursor-pointer hover:bg-secondary">
                            <Pencil className="h-3 w-3 mr-2 text-primary" /> Edit Details
                        </DropdownMenuItem>
                        {!isSample && (
                            <DropdownMenuItem onClick={() => onDeploy(agent)} disabled={isDeploying} className="cursor-pointer hover:bg-secondary">
                                {isDeployed ? <RefreshCw className="h-3 w-3 mr-2 text-primary" /> : <Rocket className="h-3 w-3 mr-2 text-primary" />}
                                {isDeployed ? 'Republish Agent' : 'Publish Agent'}
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onEmbedCode(agent)} disabled={!isDeployed && !isSample} className="cursor-pointer hover:bg-secondary">
                            <Code className="h-3 w-3 mr-2 text-primary" /> Get Embed Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(agent)} className="text-destructive cursor-pointer hover:bg-destructive/10" disabled={isSample}>
                            <Trash2 className="h-3 w-3 mr-2" /> Delete Agent
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="px-4 space-y-1 text-[11px] text-muted-foreground mt-1">
                <div className="flex items-center gap-1.5 opacity-80">
                    <span>Created:</span>
                    <span className="font-medium">{format(new Date(agent.created_at), 'dd MMM yyyy')}</span>
                </div>
                {agent.voice_name && (
                    <div className="flex items-center gap-1.5 opacity-80">
                        <span>Voice:</span>
                        <span className="font-medium truncate">{agent.voice_name}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                    <span className="opacity-70 uppercase font-bold text-[9px]">Status:</span>
                    <Badge variant="outline" className={cn("text-[9px] h-3.5 uppercase font-bold", statusColors[agent.status || 'draft'])}>{agent.status || 'draft'}</Badge>
                    <Badge variant="outline" className={cn("text-[9px] h-3.5 font-bold border-border/50", isDeployed ? "bg-green-500/5 text-green-600 border-green-200/50" : "bg-yellow-500/5 text-yellow-600 border-yellow-200/50")}>
                        {isDeployed ? 'Published' : 'Unpublished'}
                    </Badge>
                </div>
            </div>

            <div className="mt-auto px-1 overflow-hidden">
                <MiniChart isActive={isActive} />
            </div>
        </Card>
    );
}

export function AddAgentCard({ onClick }: { onClick: () => void }) {
    return (
        <Card className="group cursor-pointer border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-secondary/30 transition-all duration-300 p-6 flex flex-col items-center justify-center min-h-[160px]" onClick={onClick}>
            <div className="p-4 rounded-2xl bg-secondary group-hover:scale-110 transition-transform shadow-sm shadow-black/5">
                <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 font-bold text-lg text-foreground">Add Agent</h3>
            <p className="mt-1 text-xs text-muted-foreground font-medium">Agent Creation & Setup</p>
        </Card>
    );
}
