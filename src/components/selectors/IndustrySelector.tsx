import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
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

interface Industry {
    value: string;
    label: string;
    description?: string;
}

const DEFAULT_INDUSTRIES: Industry[] = [
    { value: 'healthcare', label: 'Healthcare', description: 'Hospitals, clinics, and medical services' },
    { value: 'real_estate', label: 'Real Estate', description: 'Property buying, selling, and management' },
    { value: 'e_commerce', label: 'E-commerce', description: 'Online retail and shopping services' },
    { value: 'finance', label: 'Finance', description: 'Banking, insurance, and investment' },
    { value: 'education', label: 'Education', description: 'Schools, universities, and online learning' },
    { value: 'customer_support', label: 'Customer Support', description: 'General help desk and support' },
    { value: 'travel_hospitality', label: 'Travel & Hospitality', description: 'Travel agencies, hotels, and tourism' },
    { value: 'automotive', label: 'Automotive', description: 'Car dealerships and repair services' },
    { value: 'legal', label: 'Legal', description: 'Law firms and legal advice' },
    { value: 'other', label: 'Other', description: 'General purpose' },
];

interface IndustrySelectorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function IndustrySelector({ value, onChange, className }: IndustrySelectorProps) {
    const [open, setOpen] = useState(false);
    const industries = DEFAULT_INDUSTRIES;

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-1.5">
                <Label>Industry <span className="text-red-500">*</span></Label>
                <InfoTooltip message="Select the business industry for better AI context." />
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
                            industries.find((item) => item.value === value)?.label || value
                        ) : (
                            "Select industry..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search industry..." />
                        <CommandList>
                            <CommandEmpty>No industry found.</CommandEmpty>
                            <CommandGroup>
                                {industries.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.label}
                                        onSelect={() => {
                                            onChange(item.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === item.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span>{item.label}</span>
                                            {item.description && (
                                                <span className="text-xs text-muted-foreground">{item.description}</span>
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
