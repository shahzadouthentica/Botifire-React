import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Users,
  MessageSquare,
  Plug,
  BookOpen,
  Mic,
  BarChart3,
  CreditCard,
  Wallet,
  Database,
  Settings,
  Menu,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navigationGroups = [
  {
    title: "",
    items: [
      { label: "Dashboard", path: "/", icon: LayoutDashboard },
      // { label: "Analytics", path: "/analytics", icon: BarChart3 },
      // { label: "Billing", path: "/subscription", icon: Wallet },
      // { label: "Settings", path: "/settings", icon: Settings },
    ]
  },
  {
    title: "Chatbots",
    items: [
      { label: "Voice Bot", path: "/voice-agents", icon: Mic },
      { label: "Textual Bot", path: "/text-bots", icon: Bot },
    ]
  },
  {
    title: "Knowledge",
    items: [
      { label: "Knowledge Base", path: "/knowledge-base", icon: Database },
    ]
  },
  {
    title: "Observe",
    items: [
      { label: "Conversations", path: "/conversations", icon: MessageSquare },
      { label: "Analytics", path: "/analytics", icon: BarChart3 },
    ]
  },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppSidebar = ({ collapsed, onToggle }: AppSidebarProps) => {
  const location = useLocation();

  const sidebarCollapsed = collapsed;

  const NavItem = ({ item }: { item: any }) => {
    const isActive = location.pathname === item.path;
    const content = (
      <NavLink
        to={item.path}
        className={cn(
          "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
          sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
          isActive
            ? "bg-card border border-border/30 shadow-sm"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        )}
      >
        <item.icon className={cn("transition-all duration-200 shrink-0", sidebarCollapsed ? "h-6 w-6" : "h-4 w-4", isActive ? "text-accent" : "text-foreground/70")} />
        {!sidebarCollapsed && (
          <div className="flex items-center justify-between flex-1 animate-fade-in translate-x-0">
            <span className={cn("truncate text-[11px]", isActive ? "text-accent font-bold" : "text-foreground/80")}>
              {item.label}
            </span>
          </div>
        )}
      </NavLink>
    );

    if (sidebarCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="rounded-lg bg-popover/95 backdrop-blur-md border-border/50">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <TooltipProvider>
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col",
          "bg-card border-r border-border/50",
          "transition-all duration-300 ease-in-out shadow-lg shadow-black/5"
        )}
      >
        <div className="relative flex h-full flex-col">
          {/* Logo Only */}
          <div className="flex h-16 items-center justify-center px-4 border-b border-border/50">
            <Link to="/" className="flex items-center justify-center group">
              {sidebarCollapsed ? (
                <img src="/images/botifire_icon.png" alt="BF" className="h-10 w-10 object-contain rounded-xl shadow-lg shadow-accent/5" />
              ) : (
                <img src="/images/botifire_logo.png" alt="Botifire" className="h-10 object-contain animate-fade-in" />
              )}
            </Link>
          </div>

          {/* Workspace Selector */}
          {!sidebarCollapsed && (
            <div className="p-3 border-b border-border/50 animate-fade-in">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1">Workspace</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("w-full justify-between h-12 mt-2", "bg-secondary/50 hover:bg-secondary/70", "border border-border/50 rounded-xl px-2")}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center ring-2 ring-accent/20">
                        <span className="text-sm font-bold text-accent">D</span>
                      </div>
                      <span className="truncate font-medium text-sm">Doplexer Solution...</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 ml-2 rounded-xl bg-popover/95 backdrop-blur-xl border-border/50">
                  <div className="px-3 py-2"><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Workspaces</span></div>
                  <DropdownMenuItem className="h-12 px-3 mx-1 my-0.5 rounded-lg cursor-pointer bg-secondary text-foreground border border-border/50 shadow-sm focus:bg-secondary focus:text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-accent">D</span>
                      </div>
                      <span className="font-bold">Doplexer Solution</span>
                    </div>
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-3.5 overflow-y-auto custom-scrollbar">
            {navigationGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                {!sidebarCollapsed && group.title && (
                  <h3 className="px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1">{group.title}</h3>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavItem key={item.label} item={item} />
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-border/30">
              <NavItem item={{ label: "Billing", path: "/subscription", icon: CreditCard }} />
              <NavItem item={{ label: "Settings", path: "/settings", icon: Settings }} />
            </div>
          </nav>

        </div>
      </motion.aside>
    </TooltipProvider>
  );
};

export default AppSidebar;
