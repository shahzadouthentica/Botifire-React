import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TextBotAgent } from '@/lib/api';
import { Copy, Check, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextBotEmbedDialogProps {
    textbot: TextBotAgent | null;
    embedCode: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TextBotEmbedDialog({ textbot, embedCode, open, onOpenChange }: TextBotEmbedDialogProps) {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = async () => {
        if (!embedCode) return;

        try {
            await navigator.clipboard.writeText(embedCode);
            setCopied(true);
            toast({
                title: 'Copied!',
                description: 'Embed code copied to clipboard',
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to copy to clipboard',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Embed Code - {textbot?.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">
                            Embed this code in your website
                        </Label>
                        <p className="text-sm text-muted-foreground mb-3">
                            Copy and paste this code snippet into your website's HTML to add the chat widget.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="bg-muted/50 rounded-lg p-4 border font-mono text-sm overflow-x-auto">
                            <pre className="whitespace-pre-wrap break-all">{embedCode || 'Loading...'}</pre>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={handleCopy}
                            disabled={!embedCode}
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Code className="h-4 w-4" />
                            Integration Instructions
                        </h4>
                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Copy the embed code above</li>
                            <li>Paste it into your website's HTML, just before the closing <code>&lt;/body&gt;</code> tag</li>
                            <li>The chat widget will appear automatically on your website</li>
                            <li>Make sure your TextBot status is set to "Active"</li>
                        </ol>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
