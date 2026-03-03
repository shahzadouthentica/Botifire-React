import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccentColor } from "@/components/providers/AccentColorProvider";
import {
    BarChart3, MessageSquare, Clock, DollarSign, Bot, Loader2, TrendingUp,
    Users, Activity, Timer, Coins, Globe, Calendar, RefreshCw, Filter,
    ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Sparkles, Zap
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#3b82f6'];

export default function Analytics() {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d' | '90d'>('30d');
    const [selectedAgent, setSelectedAgent] = useState('all');
    const { accentColor } = useAccentColor();
    const accentHex = accentColor.hex || "#A0A9DA";

    const { analytics, loading, refetch } = useAnalytics(dateRange, selectedAgent !== 'all' ? selectedAgent : undefined);

    const formatDuration = (seconds: number) => {
        if (seconds === 0) return '0s';
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        if (mins === 0) return `${secs}s`;
        return `${mins}m ${secs}s`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Chart data
    const chartData = useMemo(() => {
        return (analytics?.dailyStats || []).map(day => ({
            date: format(new Date(day.date), 'MMM d'),
            conversations: day?.conversations || 0,
            credits: Number(day?.cost) || 0,
            minutes: Math.round((day?.duration || 0) / 60),
        }));
    }, [analytics?.dailyStats]);

    const stats = [
        {
            title: 'TOTAL CONVERSATIONS',
            value: (analytics?.totalConversations || 0).toLocaleString(),
            icon: MessageSquare,
            subValue: `${analytics?.conversationsToday || 0} today`,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'TOTAL MINUTES',
            value: (Number(analytics?.totalMinutes) || 0).toFixed(1),
            icon: Timer,
            subValue: `Avg: ${formatDuration(Number(analytics?.avgDuration) || 0)}`,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            title: 'CREDITS USED',
            value: (analytics?.totalCost || 0).toLocaleString(),
            icon: Coins,
            subValue: 'Last 30 days',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            title: 'TOTAL COST',
            value: formatCurrency(analytics?.totalCostUsd || 0),
            icon: DollarSign,
            subValue: 'Estimated value',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            title: 'ACTIVE AGENTS',
            value: (analytics?.activeAgents || 0).toString(),
            icon: Bot,
            subValue: 'Deployed now',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        {
            title: 'WIDGET SESSIONS',
            value: (analytics?.widgetStats?.totalWidgetConversations || 0).toLocaleString(),
            icon: Globe,
            subValue: 'Across sites',
            color: 'text-pink-600',
            bg: 'bg-pink-50',
        },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white p-3 border border-border/40 rounded-xl shadow-xl backdrop-blur-md">
                <p className="text-xs font-bold text-muted-foreground mb-2">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry: any, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <p className="text-xs font-bold text-foreground">
                                {entry.name}: <span className="text-primary">{entry.value.toLocaleString()}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <BarChart3 className="h-7 w-7 text-primary" />
                        Analytics Dashboard
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">
                        Monitor your voice agent performance, credits, and costs
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="bg-slate-100 text-primary hover:bg-slate-200 font-bold px-4 h-9 rounded-full gap-2">
                        <Activity className="h-4 w-4" />
                        Real-time
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        className="rounded-xl bg-white font-bold h-9 border-border/40 px-4 shadow-sm"
                    >
                        <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="bg-white border-border/40 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-slate-400" />
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date Range</span>
                            <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                                <SelectTrigger className="w-[140px] h-9 bg-white border-slate-200 rounded-lg font-bold text-xs shadow-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/40">
                                    <SelectItem value="7d">Last 7 Days</SelectItem>
                                    <SelectItem value="14d">Last 14 Days</SelectItem>
                                    <SelectItem value="30d">Last 30 Days</SelectItem>
                                    <SelectItem value="90d">Last 90 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Agent</span>
                            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                                <SelectTrigger className="w-[160px] h-9 bg-white border-slate-200 rounded-lg font-bold text-xs shadow-sm">
                                    <SelectValue placeholder="All Voice Agents" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/40">
                                    <SelectItem value="all">All Voice Agents</SelectItem>
                                    {analytics?.agentStats?.map(a => (
                                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Text Bot</span>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[160px] h-9 bg-white border-slate-200 rounded-lg font-bold text-xs shadow-sm">
                                    <SelectValue placeholder="All Text Bots" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/40">
                                    <SelectItem value="all">All Text Bots</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Credit Balance Card */}
            <Card className="border-border bg-white overflow-hidden shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center" style={{ color: accentHex }}>
                                <Wallet className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Credit Balance</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-black text-foreground">117813.00</span>
                                    <span className="text-sm font-bold text-muted-foreground">credits remaining</span>
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                                    150000.00 total • 32187.00 used
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate('/subscription')}
                            className="text-white font-black px-8 h-11 rounded-2xl shadow-lg uppercase tracking-widest text-xs"
                            style={{ backgroundColor: accentHex, boxShadow: `0 10px 20px -5px ${accentHex}40` }}
                        >
                            Upgrade
                        </Button>
                    </div>
                    <div className="mt-8 space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            <span>CREDIT USAGE</span>
                            <span>21.5% USED</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '21.5%', backgroundColor: accentHex }} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white border border-border/40 rounded-3xl shadow-sm">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                    <p className="mt-4 font-bold text-muted-foreground italic text-sm">Processing analytics data...</p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                        {stats.map((stat, i) => (
                            <Card key={i} className="bg-white border-slate-100 shadow-sm overflow-hidden group hover:border-primary/30 transition-all cursor-default">
                                <CardContent className="p-4 flex flex-col justify-between h-full">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</span>
                                        <stat.icon className="h-3 w-3 text-slate-300" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Time Period Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'This Month', conversations: 3, credits: '0.00', cost: '$0.00', icon: Calendar, color: 'text-red-500', bg: 'bg-red-50' },
                            { title: 'This Week', conversations: 3, credits: '0.00', cost: '$0.00', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-50' },
                            { title: 'Today', conversations: 3, credits: '0.00', cost: '$0.00', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                        ].map((item, i) => (
                            <Card key={i} className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={cn("p-2 rounded-xl", item.bg)}>
                                            <item.icon className={cn("h-4 w-4", item.color)} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{item.title}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="text-center">
                                            <p className="text-lg font-black text-slate-900">{item.conversations}</p>
                                            <p className="text-[9px] font-bold text-slate-400 tracking-wider">Conversations</p>
                                        </div>
                                        <div className="text-center border-x border-slate-100 px-2">
                                            <p className="text-lg font-black text-slate-900">{item.credits}</p>
                                            <p className="text-[9px] font-bold text-slate-400 tracking-wider">Credits</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-black text-slate-900">{item.cost}</p>
                                            <p className="text-[9px] font-bold text-slate-400 tracking-wider">Cost</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Tabs defaultValue="trends" className="w-full">
                        <TabsList className="bg-transparent border-b border-border/50 rounded-none h-auto p-0 flex justify-start gap-8 mb-8">
                            {[
                                { label: 'Usage Trends', value: 'trends' },
                                { label: 'Credit Analysis', value: 'credit-analysis' },
                                { label: 'Agent Performance', value: 'agent-performance' },
                                { label: 'Transactions', value: 'transactions' }
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-[13px] font-semibold transition-all"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="trends" className="space-y-6">
                            <Card className="bg-white border-slate-100 shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="px-6 py-5">
                                    <CardTitle className="text-base font-black text-slate-900">
                                        Daily Conversations & Credits
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="h-[400px] w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="date"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="conversations"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    fillOpacity={1}
                                                    fill="url(#colorConversations)"
                                                    name="Conversations"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="credits"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                    fillOpacity={1}
                                                    fill="url(#colorCredits)"
                                                    name="Credits"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Credit Cost Calculator */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accentHex}15` }}>
                                <Coins className="h-4 w-4" style={{ color: accentHex }} />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Credit Cost Calculator</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: '10 minutes/day', credits: '5,000 credits', cost: '$0.75', period: 'per month' },
                                { title: '30 minutes/day', credits: '15,000 credits', cost: '$2.25', period: 'per month' },
                                { title: '60 minutes/day', credits: '30,000 credits', cost: '$4.50', period: 'per month' },
                            ].map((tier, i) => (
                                <Card key={i} className="bg-white border-slate-100 shadow-sm rounded-2xl transition-all duration-300 hover:border-border" style={{ borderBottom: `2px solid transparent`, hoverBorderBottomColor: accentHex }}>
                                    <CardContent className="p-6 text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{tier.title}</p>
                                        <p className="text-xl font-black text-slate-900">{tier.credits}</p>
                                        <p className="text-lg font-black mt-1" style={{ color: accentHex }}>{tier.cost}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{tier.period}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
