import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Trash2, Clock, Bot, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ConversationTableProps {
    data: any[];
    type: 'voice' | 'text';
    onView: (item: any) => void;
    onDelete: (id: string) => void;
}

export function ConversationTable({ data, type, onView, onDelete }: ConversationTableProps) {
    const getStatusBadgeClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'ended':
                return 'bg-green-500/10 text-green-700 border-green-200';
            case 'active':
                return 'bg-primary/5 text-primary border-primary/30';
            case 'failed':
                return 'bg-red-500/10 text-red-700 border-red-200';
            default:
                return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="rounded-xl border border-border/40 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-white">
                    <TableRow className="hover:bg-transparent border-b border-border/30">
                        <TableHead className="w-[180px] font-extrabold text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Date ↓</TableHead>
                        <TableHead className="font-extrabold text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Agent</TableHead>
                        {type === 'voice' ? (
                            <TableHead className="text-center font-extrabold text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Duration</TableHead>
                        ) : (
                            <TableHead className="text-center font-extrabold text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Credits</TableHead>
                        )}
                        <TableHead className="text-center font-extrabold text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Messages</TableHead>
                        <TableHead className="text-center font-extrabold text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right font-extrabold text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow
                            key={item.id}
                            className="group transition-colors hover:bg-slate-50 border-b border-border/20 cursor-pointer last:border-0"
                            onClick={() => onView(item)}
                        >
                            <TableCell className="font-medium text-[11px] text-muted-foreground">
                                {format(new Date(item.started_at), 'MMM d, yyyy, h:mm a')}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                                        <Bot className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="font-bold text-sm text-foreground">
                                        {item.agent?.name || item.agent_name || 'Unknown Agent'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {type === 'voice' ? (
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-sm">{formatDuration(item.duration_seconds)}</span>
                                        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">minutes</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-sm">{item.total_tokens || 0}</span>
                                        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">credits</span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="text-center">
                                <span className="font-bold text-sm">{item.message_count || item.transcript?.length || 0}</span>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge
                                    variant="outline"
                                    className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase", getStatusBadgeClass(item.status))}
                                >
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44 bg-white/95 backdrop-blur-md rounded-xl border-border/40 shadow-xl">
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(item); }} className="gap-2 py-2 cursor-pointer focus:bg-primary/5">
                                            <Eye className="h-4 w-4 text-primary" />
                                            <span className="font-bold text-xs">View Details</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                            className="gap-2 py-2 cursor-pointer text-destructive focus:bg-destructive/5"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="font-bold text-xs">Delete History</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
