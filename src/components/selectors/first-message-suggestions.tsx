import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, } from "@/components/ui/select";

const LANGUAGE_TO_COUNTRY: Record<string, string> = {
    en: "us", ur: "pk", ar: "sa", hi: "in", es: "es", fr: "fr",
};

const getFlagUrl = (langCode: string) => {
    const countryCode = LANGUAGE_TO_COUNTRY[langCode] || "us";
    return `https://flagcdn.com/w20/${countryCode}.png`;
};

const DEFAULT_MESSAGES = [
    { id: 'ur-1', label: 'UR 1', text: 'اسلام علیکم! 👋 میں آج آپ کی کس طرح مدد کر سکتا ہوں؟', description: 'Friendly general greeting (Urdu)' },
    { id: 'en-1', label: 'EN 1', text: 'Hello! 👋 How can I assist you today?', description: 'Friendly general greeting' },
    { id: 'es-1', label: 'ES 1', text: '¡Hola! 👋 ¿En qué puedo ayudarte hoy?', description: 'General greeting (Spanish)' },
];

interface FirstMessageSuggestionsProps {
    onSelect: (message: string) => void;
}

export function FirstMessageSuggestions({ onSelect }: FirstMessageSuggestionsProps) {
    const [category, setCategory] = useState<string>('en');
    const filteredMessages = DEFAULT_MESSAGES.filter(msg => msg.id.startsWith(category));
    const categories = Array.from(new Set(DEFAULT_MESSAGES.map(msg => msg.id.split('-')[0])));

    return (
        <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">Suggestions:</span>
                    <TooltipProvider>
                        {filteredMessages.map((msg) => (
                            <Tooltip key={msg.id}>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2 text-[10px] gap-1.5 hover:bg-primary/5 rounded-lg border-primary/10"
                                        onClick={() => onSelect(msg.text)}
                                    >
                                        <img src={getFlagUrl(category)} alt={msg.label} className="w-3.5 h-auto rounded-[1px]" />
                                        {msg.label}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p className="text-xs">{msg.text}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>

                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[42px] h-7 px-0 border-primary/20 bg-muted/20 rounded-lg flex items-center justify-center">
                        <img src={getFlagUrl(category)} alt={category} className="w-4 h-auto" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[50px]">
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                <img src={getFlagUrl(cat)} alt={cat} className="w-4 h-auto" />
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
