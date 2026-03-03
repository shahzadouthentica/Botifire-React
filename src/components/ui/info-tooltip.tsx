import * as React from "react";
import { HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
    message: string;
    className?: string;
    iconClassName?: string;
}

export function InfoTooltip({ message, className, iconClassName }: InfoTooltipProps) {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "inline-flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                            className
                        )}
                        onClick={(e) => e.preventDefault()}
                    >
                        <HelpCircle className={cn("h-3.5 w-3.5", iconClassName)} />
                    </button>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-[240px] p-2.5 bg-popover/95 backdrop-blur-sm border-primary/10 shadow-lg animate-in fade-in zoom-in-95"
                >
                    <p className="text-xs leading-relaxed text-popover-foreground">
                        {message}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
