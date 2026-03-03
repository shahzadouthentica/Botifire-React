import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface ResponseStyle {
    value: string;
    label: string;
    description?: string;
}

const DEFAULT_STYLES: ResponseStyle[] = [
    { value: 'friendly', label: 'Friendly', description: 'Warm and helpful tone' },
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'concise', label: 'Concise', description: 'Short and to the point' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and positive' },
    { value: 'empathic', label: 'Empathic', description: 'Understanding and supportive' },
];

interface ResponseStyleSelectorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ResponseStyleSelector({ value, onChange, className }: ResponseStyleSelectorProps) {
    const [open, setOpen] = useState(false);
    const styles = DEFAULT_STYLES;

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-1.5">
                <Label>Tone</Label>
                <InfoTooltip message="The tone and personality of the agent's responses." />
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-muted/50 border-border/50 hover:bg-muted"
                    >
                        {value ? (
                            styles.find((style) => style.value === value)?.label || value
                        ) : (
                            "Select style..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search style..." />
                        <CommandList className="max-h-[260px] overflow-y-auto">
                            <CommandEmpty>No style found.</CommandEmpty>
                            <CommandGroup>
                                {styles.map((style) => (
                                    <CommandItem
                                        key={style.value}
                                        value={style.label}
                                        onSelect={() => {
                                            onChange(style.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === style.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span>{style.label}</span>
                                            {style.description && (
                                                <span className="text-xs text-muted-foreground">{style.description}</span>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
