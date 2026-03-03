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

interface Language {
    value: string;
    label: string;
}

const DEFAULT_LANGUAGES: Language[] = [
    { value: 'en', label: 'English' },
    { value: 'ur', label: 'Urdu' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hi', label: 'Hindi' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
];

interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function LanguageSelector({ value, onChange, className }: LanguageSelectorProps) {
    const [open, setOpen] = useState(false);
    const languages = DEFAULT_LANGUAGES;

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-1.5">
                <Label>Language</Label>
                <InfoTooltip message="The language used for internal configuration and processing." />
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
                            languages.find((lang) => lang.value === value)?.label || value
                        ) : (
                            "Select language..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList className="max-h-[260px] overflow-y-auto">
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                                {languages.map((lang) => (
                                    <CommandItem
                                        key={lang.value}
                                        value={lang.label}
                                        onSelect={() => {
                                            onChange(lang.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === lang.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {lang.label}
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
