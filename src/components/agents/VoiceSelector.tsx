import { useState, useEffect, useRef } from 'react';
import { voicesApi, Voice } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Loader2, Check, Volume2, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface VoiceSelectorProps {
    value: string | null;
    onChange: (voice: { id: string; name: string } | null) => void;
}

export function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
    const [voices, setVoices] = useState<Voice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetchVoices();
    }, []);

    const fetchVoices = async () => {
        try {
            setLoading(true);
            const result = await voicesApi.list();

            if (!result.success) throw new Error(result.error || 'Failed to fetch voices');

            if (result.data) {
                setVoices(result.data);
            }
        } catch (err: any) {
            console.error('Error fetching voices:', err);
            setError(err.message || 'Failed to load voices');
        } finally {
            setLoading(false);
        }
    };

    const selectedVoice = voices.find(v => v.voice_id === value);

    const handleSelect = (voiceId: string) => {
        const voice = voices.find(v => v.voice_id === voiceId);
        if (!voice) return;

        if (value === voiceId) {
            onChange(null);
        } else {
            onChange({ id: voice.voice_id, name: voice.name });
        }
        setOpen(false);
    };

    const playPreview = async (voice: Voice, e: React.MouseEvent) => {
        e.stopPropagation();

        if (playingVoiceId === voice.voice_id && audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setPlayingVoiceId(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        try {
            setPlayingVoiceId(voice.voice_id);
            let audioUrl = voice.preview_url;

            if (!audioUrl) {
                throw new Error('Preview URL not available');
            }

            const audio = new Audio(audioUrl);
            audio.onended = () => {
                setPlayingVoiceId(null);
                audioRef.current = null;
            };
            audio.onerror = () => {
                setPlayingVoiceId(null);
                audioRef.current = null;
            };
            audioRef.current = audio;
            await audio.play();
        } catch (err) {
            console.error('Error playing preview:', err);
            setPlayingVoiceId(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-2">
                <Label>Voice</Label>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading voices...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-2">
                <Label>Voice</Label>
                <p className="text-sm text-destructive">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5">
                <Label>Select Voice <span className="text-red-500">*</span></Label>
                <InfoTooltip message="Select a voice for your AI agent." />
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-muted/50 border-border/50 hover:bg-muted"
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            {selectedVoice ? (
                                <>
                                    <span className="truncate">{selectedVoice.name}</span>
                                </>
                            ) : (
                                <span className="text-muted-foreground">Select a voice...</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {selectedVoice && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-primary/20 hover:text-primary"
                                    onClick={(e) => playPreview(selectedVoice, e)}
                                >
                                    {playingVoiceId === selectedVoice.voice_id ? (
                                        <Pause className="h-3 w-3" />
                                    ) : (
                                        <Volume2 className="h-3 w-3" />
                                    )}
                                </Button>
                            )}
                            <Check className={cn("h-4 w-4 opacity-50", selectedVoice ? "opacity-100" : "opacity-0")} />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search voices..." />
                        <CommandList className="max-h-[260px] overflow-y-auto">
                            <CommandEmpty>No voice found.</CommandEmpty>
                            <CommandGroup>
                                {voices.map((voice) => (
                                    <CommandItem
                                        key={voice.voice_id}
                                        value={voice.name}
                                        onSelect={() => handleSelect(voice.voice_id)}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <Check
                                                className={cn(
                                                    "h-4 w-4 flex-shrink-0",
                                                    value === voice.voice_id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="truncate font-medium">{voice.name}</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                            onClick={(e) => playPreview(voice, e)}
                                        >
                                            {playingVoiceId === voice.voice_id ? (
                                                <Pause className="h-4 w-4" />
                                            ) : (
                                                <Volume2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <p className="text-xs text-muted-foreground">
                Select the voice for your agent. Click the speaker icon to preview.
            </p>
        </div>
    );
}
