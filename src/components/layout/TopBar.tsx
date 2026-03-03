import {
  Bell,
  Search,
  PanelLeft,
  User,
  Settings,
  CreditCard,
  LogOut,
  Palette,
  BarChart3,
  Sun,
  Moon,
  Monitor,
  MessageSquare,
  Book,
  HelpCircle,
  TrendingUp,
  Clock,
  Zap,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAccentColor, colors } from "@/components/providers/AccentColorProvider";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  onMobileMenuToggle?: () => void;
}

const TopBar = ({ title, onMobileMenuToggle }: TopBarProps) => {
  const { setTheme } = useTheme();
  const { accentColor, setCustomColor, setPresetColor } = useAccentColor();
  const accentHex = accentColor.hex || "#A0A9DA";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-all duration-200 border border-border/50"
        >
          <PanelLeft size={16} />
        </button>
        <h1 className="text-lg font-bold text-foreground tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-2 text-sm text-muted-foreground w-64 transition-all duration-200 hover:bg-secondary/50 focus-within:ring-2 focus-within:ring-accent/20">
          <Search size={15} />
          <span className="font-medium text-xs">Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all duration-200 border border-border/50">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] mt-2 rounded-3xl shadow-2xl p-0 bg-white border-border/40 overflow-hidden">
            <div className="p-6 border-b border-border/40 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Recent Transactions</h3>
              <Badge variant="outline" className="bg-red-50 text-red-500 border-red-100 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                TOP 10
              </Badge>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
              {[
                { type: 'Usage', desc: 'VoiceBot Call (12s) - 81 credits', cost: '- 81', time: '12 days ago' },
                { type: 'Usage', desc: 'VoiceBot Call (222s) - 1474 credits', cost: '- 1,474', time: '12 days ago' },
                { type: 'Usage', desc: 'VoiceBot Call (64s) - 423 credits', cost: '- 423', time: '12 days ago' },
                { type: 'Usage', desc: 'VoiceBot Call (18s) - 119 credits', cost: '- 119', time: '12 days ago' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{tx.type}</span>
                      <span className="text-xs font-black text-slate-900">{tx.cost}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold truncate mb-1">{tx.desc}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <Clock className="h-3 w-3" /> {tx.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border/40 text-center bg-slate-50/30">
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">
                View All Activity
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Wallet / Balance */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all duration-200 border border-border/50">
              <Wallet size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] mt-2 rounded-3xl shadow-2xl p-5 bg-white border-border/40">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-900">
                  <CreditCard size={14} className="stroke-[2.5]" />
                </div>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Balance</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">21% used</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-sm font-black text-slate-900">150,000 credits</span>
              </div>

              <Progress value={21} className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full transition-all" style={{ width: '21%', backgroundColor: accentHex }} />
              </Progress>

              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining</span>
                <span className="text-sm font-black text-slate-900">117,813</span>
              </div>
            </div>

            <Button className="w-full text-white rounded-2xl h-10 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all duration-300" style={{ backgroundColor: accentHex, boxShadow: `0 8px 16px -4px ${accentHex}50` }}>
              Upgrade Plan
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <Avatar className="h-9 w-9 border border-border group-hover:opacity-80 transition-all shadow-sm">
                <AvatarImage src="/images/botifire_icon.png" className="object-contain p-1" />
                <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">DS</AvatarFallback>
              </Avatar>
              <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm animate-pulse" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] mt-2 rounded-2xl shadow-2xl p-2 bg-popover/95 backdrop-blur-xl border-border/50">
            {/* Workspace Section */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Current workspace</span>
                <Badge variant="destructive" className="h-4 px-1 text-[9px] uppercase font-bold rounded-sm">Starter plan</Badge>
              </div>
              <div className="flex items-center justify-between group cursor-pointer">
                <span className="text-sm font-bold truncate">Doplexer Solutions's Workspace</span>
                <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="flex gap-3 mt-2">
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare size={12} /> Feedback
                </button>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                  <Book size={12} /> Docs
                </button>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                  <HelpCircle size={12} /> Ask
                </button>
              </div>
            </div>

            <DropdownMenuSeparator className="my-2 bg-border/40" />

            {/* Menu Items */}
            <div className="space-y-0.5">
              <DropdownMenuItem className="rounded-lg h-9 gap-3 cursor-pointer focus:bg-secondary focus:text-foreground">
                <Settings size={16} />
                <span className="font-medium text-xs">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg h-9 gap-3 cursor-pointer focus:bg-secondary focus:text-foreground">
                <CreditCard size={16} />
                <span className="font-medium text-xs">Subscription</span>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-lg h-9 gap-3 cursor-pointer focus:bg-secondary focus:text-foreground data-[state=open]:bg-secondary data-[state=open]:text-foreground">
                  <Palette size={16} />
                  <span className="font-medium text-xs">Theme & Color</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl shadow-xl bg-popover/95 backdrop-blur-xl p-2 border-border/50 min-w-[200px] space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">Mode</span>
                      <div className="grid grid-cols-3 gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("light")}
                          className="h-8 rounded-lg flex flex-col items-center gap-1 hover:bg-secondary"
                        >
                          <Sun size={14} />
                          <span className="text-[9px]">Light</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("dark")}
                          className="h-8 rounded-lg flex flex-col items-center gap-1 hover:bg-secondary"
                        >
                          <Moon size={14} />
                          <span className="text-[9px]">Dark</span>
                        </Button>

                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 border-t border-border/40">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Accent Color</span>
                        <div className="relative">
                          <Button variant="ghost" size="sm" className="h-6 px-1.5 gap-1.5 hover:bg-secondary">
                            <Palette size={12} className="text-muted-foreground" />
                            <span className="text-[9px] font-bold">Pick Color</span>
                          </Button>
                          <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                            value={accentColor.hex || "#1fb881"}
                            onInput={(e) => setCustomColor((e.target as HTMLInputElement).value)}
                          />
                        </div>
                      </div>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem className="rounded-lg h-9 gap-3 cursor-pointer focus:bg-secondary focus:text-foreground">
                <BarChart3 size={16} />
                <span className="font-medium text-xs">Usage analytics</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg h-9 gap-3 cursor-pointer focus:bg-secondary focus:text-foreground">
                <User size={16} />
                <span className="font-medium text-xs">Profile</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="my-2 bg-border/40" />

            <DropdownMenuItem className="rounded-lg h-9 gap-3 cursor-pointer text-destructive focus:bg-destructive/10">
              <LogOut size={16} />
              <span className="font-bold text-xs">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
