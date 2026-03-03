import { useMemo } from "react";
import { Sparkles, Activity, RefreshCw, Filter, Bot, MessageSquare, Wallet, BarChart3, ChevronRight, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { useAccentColor } from "@/components/providers/AccentColorProvider";

// --- Mock Data ---

// 1. General Tab Data
const generalChartData = [
  { date: "Dec 19", conversations: 5, credits: 800, minutes: 12 },
  { date: "Dec 23", conversations: 12, credits: 1500, minutes: 25 },
  { date: "Dec 27", conversations: 8, credits: 1100, minutes: 18 },
  { date: "Dec 31", conversations: 15, credits: 2400, minutes: 35 },
  { date: "Jan 4", conversations: 10, credits: 1600, minutes: 22 },
  { date: "Jan 8", conversations: 18, credits: 3200, minutes: 45 },
  { date: "Jan 12", conversations: 14, credits: 2800, minutes: 38 },
  { date: "Jan 16", conversations: 22, credits: 4500, minutes: 55 },
  { date: "Jan 20", conversations: 12, credits: 2200, minutes: 30 },
  { date: "Jan 24", conversations: 25, credits: 5800, minutes: 70 },
  { date: "Jan 28", conversations: 18, credits: 4200, minutes: 48 },
  { date: "Feb 1", conversations: 30, credits: 7800, minutes: 95 },
  { date: "Feb 5", conversations: 45, credits: 12000, minutes: 130 },
  { date: "Feb 9", conversations: 55, credits: 16000, minutes: 180 },
  { date: "Feb 13", conversations: 85, credits: 52000, minutes: 450 },
  { date: "Feb 17", conversations: 40, credits: 12000, minutes: 140 },
];
const generalPieData = [
  { name: "MCB Bank Pak...", value: 36, color: "#3b82f6" },
  { name: "Bank Pak...", value: 34, color: "#8b5cf6" },
  { name: "Meezan Bank ...", value: 15, color: "#f43f5e" },
  { name: "Support Assi...", value: 5, color: "#f97316" },
  { name: "Botifire Bot", value: 5, color: "#10b981" },
  { name: "Botifire", value: 3, color: "#6366f1" },
  { name: "Pyari Walls", value: 2, color: "#a855f7" },
];
const generalStats = [
  { label: "Total conversations", value: "88" },
  { label: "Today", value: "0" },
  { label: "This month", value: "29" },
  { label: "Total duration", value: "83.7", suffix: "min" },
  { label: "Avg voice duration", value: "1m 3s" },
  { label: "Total credits", value: "86507" },
  { label: "Month credits", value: "62532" },
  { label: "Total USD", value: "$5.0035" },
];

// 2. Voice Tab Data
const voiceAgents = [
  { name: "texting", desc: "No description", status: "ACTIVE", calls: 0, credits: "0.0" },
  { name: "Pyari Walls", desc: "No description", status: "ACTIVE", calls: 2, credits: "37.0" },
  { name: "Botifre", desc: "No description", status: "ACTIVE", calls: 3, credits: "3314.0" },
  { name: "Meezan Bank Pakistan", desc: "No description", status: "DRAFT", calls: 13, credits: "1193.0" },
  { name: "MCB Bank Pakistan Testing Agent 2", desc: "No description", status: "DISABLED", calls: 32, credits: "17378.0" },
  { name: "MCB Bank Pakistan Testing Agent", desc: "MCB Bank Pakistan", status: "ACTIVE", calls: 30, credits: "11374.0" }
];

const voicePerformance = [
  { name: "MCB Bank Pakistan Testing Agent 2", conv: 32, credits: "17378.00", cost: "$2.6067", totalDur: "43m 40s", avgDur: "1m 22s", usage: 20.1 },
  { name: "MCB Bank Pakistan Testing Agent", conv: 30, credits: "11274.00", cost: "$1.7061", totalDur: "28m 23s", avgDur: "57s", usage: 13.1 },
  { name: "Meezan Bank Pakistan", conv: 13, credits: "1193.00", cost: "$0.179", totalDur: "3m 16s", avgDur: "15s", usage: 1.4 },
  { name: "Botifre", conv: 3, credits: "3314.00", cost: "$0.4071", totalDur: "8m 18s", avgDur: "2m 46s", usage: 3.8 },
  { name: "Pyari Walls", conv: 2, credits: "37.00", cost: "$0.0055", totalDur: "5s", avgDur: "3s", usage: 0.0 }
];

// 3. Text Tab Data
const textAgents = [
  { name: "Botifre", desc: "No description", status: "ACTIVE", chats: 0, credits: "0.0" },
  { name: "Botifire Bot", desc: "Botifire Bot", status: "ACTIVE", chats: 4, credits: "51835.0" },
  { name: "Texting perpose", desc: "Texting perpose", status: "DRAFT", chats: 0, credits: "0.0" },
  { name: "Support Assistant 3", desc: "Customer support ke liye AI text bot", status: "ACTIVE", chats: 4, credits: "1376.0" },
  { name: "Support Assistant 2", desc: "Customer support ke liye AI text bot", status: "DRAFT", chats: 0, credits: "0.0" },
  { name: "Support Assistant", desc: "Customer support ke liye AI text bot", status: "DISABLED", chats: 0, credits: "0.0" }
];

const textPerformance = [
  { name: "Support Assistant 3", conv: 4, credits: "1376.00", cost: "$0.2064", inputTokens: 1376, avgUsage: "344", usage: 1.5 },
  { name: "Botifre Bot", conv: 4, credits: "51835.00", cost: "$7.7752", inputTokens: 51835, avgUsage: "12959", usage: 53.8 }
];

// 4. Usage Tab Data
const usageServiceData = [
  { name: "Text Agent", requests: 300, credits: 52000 } // Slight bump to requests so bar is visible
];
const usageMinutesTokensData = [
  { date: "Dec 19", minutes: 2, credits: 5000 },
  { date: "Dec 22", minutes: 6, credits: 12000 },
  { date: "Jan 5", minutes: 2, credits: 3000 },
  { date: "Jan 20", minutes: 8, credits: 18000 },
  { date: "Jan 29", minutes: 4, credits: 6000 },
  { date: "Feb 8", minutes: 12, credits: 24000 },
  { date: "Feb 12", minutes: 4, credits: 8000 },
  { date: "Feb 16", minutes: 18, credits: 45000 }
];

// Helper: Status Badge Mapper
const StatusBadge = ({ status, accentHex }: { status: string, accentHex: string }) => {
  if (status === "ACTIVE") return <Badge className="bg-accent/10 hover:bg-accent/20 border-accent/20 px-2 py-0" style={{ color: accentHex, fontSize: '9px' }}>ACTIVE</Badge>;
  if (status === "DRAFT") return <Badge className="bg-amber-100/50 hover:bg-amber-100 border-amber-200 text-amber-600 px-2 py-0" style={{ fontSize: '9px' }}>DRAFT</Badge>;
  if (status === "DISABLED") return <Badge className="bg-muted hover:bg-muted border-border text-muted-foreground px-2 py-0" style={{ fontSize: '9px' }}>DISABLED</Badge>;
  return null;
};

const Index = () => {
  const { accentColor } = useAccentColor();
  const accentHex = accentColor.hex || "#A0A9DA";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* V2 Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-destructive fill-destructive/20" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                DOPLEXER SOLUTIONS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Good morning, <span className="bg-muted px-2 py-0.5 rounded-md" style={{ color: accentHex }}>Doplexer</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-accent/5 border-accent/20 flex items-center gap-1.5 h-8 rounded-2xl" style={{ color: accentHex }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentHex }} />
              <span className="text-[10px] font-bold">Real-time</span>
            </Badge>
            <Button variant="outline" size="sm" className="h-8 rounded-2xl gap-2 border-border/60 hover:bg-secondary">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-bold">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs and Filters Section */}
      <Tabs defaultValue="general" className="space-y-6">
        <div className="flex flex-col gap-5">
          <TabsList className="bg-transparent border-b border-border/50 rounded-none h-auto p-0 flex justify-start gap-8">
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-[13px] font-semibold transition-all"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-[13px] font-semibold transition-all"
            >
              Voice Agents
            </TabsTrigger>
            <TabsTrigger
              value="text"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-[13px] font-semibold transition-all"
            >
              Text Agents
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-[13px] font-semibold transition-all"
            >
              Usage & Costs
            </TabsTrigger>
          </TabsList>

          {/* Filter Bar */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date Range</span>
              <Select defaultValue="90d">
                <SelectTrigger className="w-[140px] h-8 text-[11px] font-medium bg-background border-border/60 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/60">
                  <SelectItem value="7d">Last week</SelectItem>
                  <SelectItem value="30d">Last month</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 border-l border-border/40 pl-6">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Granularity</span>
              <Select defaultValue="day">
                <SelectTrigger className="w-[100px] h-8 text-[11px] font-medium bg-background border-border/60 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/60">
                  <SelectItem value="hour">Hour</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 border-l border-border/40 pl-6">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Agent</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] h-8 text-[11px] font-medium bg-background border-border/60 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/60">
                  <SelectItem value="all">All Agents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* GENERAL TAB CONTENT */}
        <TabsContent value="general" className="space-y-6 mt-0">
          <DashboardGeneralContent accentHex={accentHex} stats={generalStats} chartData={generalChartData} pieData={generalPieData} />
        </TabsContent>

        {/* VOICE AGENTS TAB CONTENT */}
        <TabsContent value="voice" className="space-y-6 mt-0">
          {/* Top Card: Voice Agents List */}
          <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="pl-6 py-5 border-b border-border/40 bg-card">
              <div className="flex items-center gap-2">
                <Bot size={16} style={{ color: accentHex }} />
                <CardTitle className="text-sm font-bold text-foreground">Voice Agents</CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1">Manage and monitor your voice conversations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {voiceAgents.map((agent, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Bot size={20} style={{ color: accentHex }} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-sm text-foreground">{agent.name}</p>
                          <StatusBadge status={agent.status} accentHex={accentHex} />
                        </div>
                        <p className="text-xs text-muted-foreground">{agent.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm font-black text-foreground">{agent.calls}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Calls</p>
                      </div>
                      <div className="text-center w-16">
                        <p className="text-sm font-black text-foreground">{agent.credits}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Credits</p>
                      </div>
                      <Button variant="ghost" className="text-xs font-bold px-4 hover:bg-secondary h-8 hover:text-foreground transition-colors">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Card: Voice Agent Performance */}
          <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden mt-6">
            <CardHeader className="pl-6 py-5 border-b border-border/40 bg-card">
              <div className="flex items-center gap-2">
                <Activity size={16} style={{ color: accentHex }} />
                <CardTitle className="text-sm font-bold text-foreground">Voice Agent Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {voicePerformance.map((perf, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentHex }} />
                        <h4 className="text-sm font-bold text-foreground">{perf.name}</h4>
                      </div>
                      <Badge variant="secondary" className="bg-secondary px-3 py-1 text-xs font-semibold rounded-lg text-foreground bg-muted border-transparent">
                        {perf.conv} conversations
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 px-1">
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Credits</p>
                        <p className="text-sm font-bold text-foreground">{perf.credits}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cost</p>
                        <p className="text-sm font-bold text-foreground">{perf.cost}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Duration</p>
                        <p className="text-sm font-bold text-foreground">{perf.totalDur}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Avg Duration</p>
                        <p className="text-sm font-bold text-foreground">{perf.avgDur}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 px-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Usage Share</p>
                        <p className="text-[10px] font-bold text-muted-foreground">{perf.usage.toFixed(1)}%</p>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-1000" style={{ width: `${perf.usage}%`, backgroundColor: accentHex }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEXT AGENTS TAB CONTENT */}
        <TabsContent value="text" className="space-y-6 mt-0">
          {/* Top Card: Text Agents List */}
          <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="pl-6 py-5 border-b border-border/40 bg-card">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} style={{ color: accentHex }} />
                <CardTitle className="text-sm font-bold text-foreground">Text Agents</CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1">Manage and monitor your text-based AI assistants</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {textAgents.map((agent, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <MessageSquare size={18} style={{ color: accentHex }} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-sm text-foreground">{agent.name}</p>
                          <StatusBadge status={agent.status} accentHex={accentHex} />
                        </div>
                        <p className="text-xs text-muted-foreground">{agent.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center w-12">
                        <p className="text-sm font-black text-foreground">{agent.chats}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Chats</p>
                      </div>
                      <div className="text-center w-16">
                        <p className="text-sm font-black text-foreground">{agent.credits}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Credits</p>
                      </div>
                      <Button variant="ghost" className="text-xs font-bold px-4 hover:bg-secondary h-8 hover:text-foreground transition-colors">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Card: Text Agent Performance */}
          <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden mt-6">
            <CardHeader className="pl-6 py-5 border-b border-border/40 bg-card">
              <div className="flex items-center gap-2">
                <Activity size={16} style={{ color: accentHex }} />
                <CardTitle className="text-sm font-bold text-foreground">Text Agent Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {textPerformance.map((perf, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentHex }} />
                        <h4 className="text-sm font-bold text-foreground">{perf.name}</h4>
                      </div>
                      <Badge variant="secondary" className="bg-secondary px-3 py-1 text-xs font-semibold rounded-lg text-foreground bg-muted border-transparent">
                        {perf.conv} conversations
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 px-1">
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Credits</p>
                        <p className="text-sm font-bold text-foreground">{perf.credits}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cost</p>
                        <p className="text-sm font-bold text-foreground">{perf.cost}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Input Tokens</p>
                        <p className="text-sm font-bold text-foreground">{perf.inputTokens}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Avg Usage</p>
                        <p className="text-sm font-bold text-foreground">{perf.avgUsage}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 px-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Usage Share</p>
                        <p className="text-[10px] font-bold text-muted-foreground">{perf.usage.toFixed(1)}%</p>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-1000" style={{ width: `${perf.usage}%`, backgroundColor: accentHex }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USAGE & COSTS TAB CONTENT */}
        <TabsContent value="usage" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Chart: Usage by Service */}
            <Card className="border-border/60 shadow-sm rounded-xl">
              <CardHeader className="pl-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Zap size={16} style={{ color: accentHex }} />
                  <CardTitle className="text-sm font-bold text-foreground">Usage by Service</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageServiceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }}
                        dx={-10}
                        domain={[0, 60000]}
                      />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                      <Legend
                        iconType="square"
                        wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        formatter={(value, entry) => <span className="text-foreground ml-1">{value}</span>}
                      />
                      <Bar dataKey="requests" name="Requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="credits" name="Credits" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Right Chart: Minutes & Tokens */}
            <Card className="border-border/60 shadow-sm rounded-xl">
              <CardHeader className="pl-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} style={{ color: accentHex }} />
                  <CardTitle className="text-sm font-bold text-foreground">Minutes & Tokens</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageMinutesTokensData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                        dy={10}
                      />

                      {/* Left Y Axis for Minutes */}
                      <YAxis
                        yAxisId="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                        domain={[0, 20]}
                      />

                      {/* Right Y Axis for Credits (scaled visually) */}
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                        domain={[0, 60000]}
                      />

                      <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                      <Legend
                        iconType="square"
                        wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        formatter={(value, entry) => <span className="text-foreground ml-1">{value}</span>}
                      />
                      <Bar yAxisId="left" dataKey="minutes" name="Minutes" fill="#8b5cf6" radius={[2, 2, 0, 0]} barSize={8} />
                      <Bar yAxisId="right" dataKey="credits" name="Credits" fill="#ec4899" radius={[2, 2, 0, 0]} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Card: Credit Balance */}
          <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden bg-gradient-to-r from-card to-card hover:to-accent/5 transition-colors border-l-4" style={{ borderLeftColor: accentHex }}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Wallet size={24} style={{ color: accentHex }} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Credit Balance</p>
                    <h2 className="text-3xl font-black text-foreground">117,813 <span className="text-base font-medium text-muted-foreground ml-1">credits remaining</span></h2>
                    <p className="text-sm font-medium text-muted-foreground">150,000 total &bull; 32,187 used</p>
                  </div>
                </div>
                <Button className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-accent/20 bg-accent text-primary-foreground hover:bg-accent/90" style={{ backgroundColor: accentHex }}>
                  View Full Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Reusable Dashboard Content Component for General Tab ---
const DashboardGeneralContent = ({
  accentHex,
  stats,
  chartData,
  pieData
}: {
  accentHex: string,
  stats: any[],
  chartData: any[],
  pieData: any[]
}) => (
  <>
    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 divide-x divide-y md:divide-y-0 border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm">
      {stats.map((stat, i) => (
        <div key={i} className="p-4 flex flex-col gap-1.5 border-border/40">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate" title={stat.label}>{stat.label}</p>
          <p className="text-xl font-black text-foreground tracking-tight">
            {stat.value}
            {stat.suffix && <span className="text-[11px] font-medium text-muted-foreground ml-1">{stat.suffix}</span>}
          </p>
        </div>
      ))}
    </div>

    {/* Main Area Chart */}
    <Card className="border-border/60 shadow-sm overflow-hidden rounded-xl">
      <CardContent className="p-0">
        <div className="h-[400px] w-full pt-8 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentHex} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={accentHex} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '11px',
                  fontWeight: '600'
                }}
                cursor={{ stroke: accentHex, strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="credits"
                stroke={accentHex}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorUsage)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

    {/* Bottom Grid: Success Rate & Agent Distribution */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
      {/* Overall Success Rate */}
      <Card className="border-border/60 shadow-sm rounded-xl">
        <CardContent className="pt-6 px-6">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 px-0.5">Overall Success Rate</h3>
            <p className="text-4xl font-black text-foreground">100.0%</p>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9, fontWeight: 600 }}
                  dy={8}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="conversations"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Agent Distribution */}
      <Card className="border-border/60 shadow-sm rounded-xl">
        <CardContent className="pt-6 px-6 relative">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 px-0.5">Distribution</h3>
          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Labels List */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
            {pieData.map((agent, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                <span className="text-[10px] font-bold text-muted-foreground">{agent.name} {agent.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </>
);

export default Index;
