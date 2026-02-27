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
  PiggyBank,
  ArrowUpRight,
  MessageSquare,
  Book,
  HelpCircle,
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
        <button className="relative p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all duration-200 border border-border/50">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
        </button>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer group">
              <Avatar className="h-9 w-9 border border-border group-hover:opacity-80 transition-all">
                <AvatarImage src="/images/botifire_icon.png" className="object-contain p-1" />
                <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">BF</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] mt-2 rounded-2xl shadow-2xl p-2 bg-popover/95 backdrop-blur-xl border-border/50">
            {/* Balance Section */}
            <div className="p-3 bg-secondary/40 rounded-xl mb-2 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-accent/10 rounded-lg text-accent">
                    <PiggyBank size={16} />
                  </div>
                  <span className="text-sm font-bold">Balance</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">21% used</span>
              </div>
              
              <div className="space-y-1 mb-3 text-[11px] font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-foreground font-bold">150,000 credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining</span>
                  <span className="text-foreground font-bold">117,813</span>
                </div>
              </div>

              <Progress value={21} className="h-2 mb-4 bg-muted overflow-hidden">
                <div className="h-full bg-destructive transition-all" style={{ width: '21%' }} />
              </Progress>

              <Button className="w-full bg-destructive hover:bg-destructive/90 text-white rounded-xl h-9 text-xs font-bold shadow-lg shadow-destructive/20 border-none">
                Upgrade
              </Button>
            </div>

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
