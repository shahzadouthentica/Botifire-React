import { Bell, Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopBarProps {
  title: string;
  onMobileMenuToggle?: () => void;
}

const TopBar = ({ title, onMobileMenuToggle }: TopBarProps) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-md hover:bg-secondary text-muted-foreground md:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground w-64">
          <Search size={14} />
          <span>Search... ⌘K</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* User avatar */}
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">
            BF
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default TopBar;
