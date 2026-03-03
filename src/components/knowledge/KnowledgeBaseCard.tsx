import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    FileText,
    Link as LinkIcon,
    Upload,
    HelpCircle,
    MoreVertical,
    Pencil,
    Trash2,
    Eye,
    ChevronRight,
    Clock,
    Sparkles
} from 'lucide-react';
import { KnowledgeBase } from '@/hooks/useKnowledgeBases';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface KnowledgeBaseCardProps {
    kb: KnowledgeBase;
    onEdit: (kb: KnowledgeBase) => void;
    onDelete: (id: string) => void;
    onView: (kb: KnowledgeBase) => void;
    onDeploy: (id: string) => void;
}

const typeConfigs: Record<string, {
    icon: React.ComponentType<any>;
    label: string;
    color: string;
    bg: string;
}> = {
    text: {
        icon: FileText,
        label: 'Text',
        color: 'text-primary',
        bg: 'bg-primary/10',
    },
    pdf: {
        icon: Upload,
        label: 'PDF',
        color: 'text-primary',
        bg: 'bg-primary/10',
    },
    url: {
        icon: LinkIcon,
        label: 'URL',
        color: 'text-primary',
        bg: 'bg-primary/10',
    },
    faq: {
        icon: HelpCircle,
        label: 'FAQ',
        color: 'text-primary',
        bg: 'bg-primary/10',
    },
};

// Mini visualization component
const MiniVisualization = ({ isActive }: { isActive: boolean }) => {
    const color = isActive ? 'stroke-primary/40' : 'stroke-muted-foreground/20';
    const fillGradientId = `gradient-kb-${isActive ? 'active' : 'inactive'}`;

    return (
        <svg className="w-full h-8 opacity-40 mt-1" viewBox="0 0 100 24" preserveAspectRatio="none">
            <defs>
                <linearGradient id={fillGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d="M0 20 Q 10 15, 20 17 T 40 14 T 60 16 T 80 12 T 100 15 L 100 24 L 0 24 Z"
                fill={`url(#${fillGradientId})`}
            />
            <path
                d="M0 20 Q 10 15, 20 17 T 40 14 T 60 16 T 80 12 T 100 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={color}
            />
        </svg>
    );
};

export function KnowledgeBaseCard({ kb, onEdit, onDelete, onView, onDeploy }: KnowledgeBaseCardProps) {
    const config = typeConfigs[kb.knowledge_type || 'text'] || typeConfigs.text;
    const Icon = config.icon;

    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-300 flex flex-col min-h-[140px]",
            "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
            "bg-white border-border/40 hover:border-primary/30"
        )}>
            <CardHeader className="p-3 pb-2 pt-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                            "p-2.5 rounded-xl transition-transform group-hover:scale-105",
                            config.bg,
                            config.color
                        )}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
                                {kb.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-[9px] h-3.5 bg-accent/20 text-black border-accent/20 font-bold uppercase tracking-wider">
                                    {config.label}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 transition-opacity shrink-0 hover:bg-secondary"
                            >
                                <MoreVertical className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-popover/95 backdrop-blur-md border-border/50">
                            <DropdownMenuItem onClick={() => onView(kb)} className="text-xs py-1.5 cursor-pointer hover:bg-secondary">
                                <Eye className="mr-2 h-3.5 w-3.5 text-primary" />
                                View Content
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(kb)} className="text-xs py-1.5 cursor-pointer hover:bg-secondary">
                                <Pencil className="mr-2 h-3.5 w-3.5 text-primary" />
                                Edit Basic Info
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem onClick={() => onDeploy(kb.id)} className="text-xs py-1.5 cursor-pointer hover:bg-secondary">
                                <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
                                Deploy to Bot
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(kb.id)}
                                className="text-xs py-1.5 text-destructive cursor-pointer hover:bg-destructive/10"
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete Source
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="p-3 pt-0 flex-1">
                <MiniVisualization isActive={true} />
            </CardContent>

            <CardFooter className="p-3 pt-2 border-t border-border/30 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                    <Clock className="h-3 w-3 opacity-60" />
                    {format(new Date(kb.created_at), 'MMM dd, yyyy')}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-[11px] font-bold h-7 group/btn hover:text-primary hover:bg-transparent p-0"
                    onClick={() => onView(kb)}
                >
                    View
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
            </CardFooter>
        </Card>
    );
}

export function AddKnowledgeCard({ onClick }: { onClick: () => void }) {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-300",
                "border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-white",
                "flex flex-col items-center justify-center min-h-[160px] bg-slate-50/30"
            )}
            onClick={onClick}
        >
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <div className={cn(
                    "p-4 rounded-2xl bg-white transition-all duration-300 shadow-sm border border-border/20",
                    "group-hover:scale-110 group-hover:bg-primary/10 group-hover:shadow-primary/10"
                )}>
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 font-bold text-lg text-foreground">
                    Add Knowledge
                </h3>
                <p className="mt-1 text-xs text-muted-foreground text-center font-medium">
                    Upload to train agents
                </p>
            </CardContent>
        </Card>
    );
}
