import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
    Loader2,
    Upload,
    Globe,
    FileUp,
    TextCursor,
    MessageSquare,
    Plus,
    Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { KnowledgeBase } from '@/hooks/useKnowledgeBases';

const kbSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type KBFormData = z.infer<typeof kbSchema>;

interface KnowledgeBaseFormProps {
    initialData?: KnowledgeBase;
    onSubmit: (data: {
        name: string;
        description?: string;
        knowledge_type: 'text' | 'pdf' | 'url' | 'faq';
        content?: string;
        file_url?: string;
        source_url?: string;
        file?: File;
    }) => Promise<void>;
    onCancel: () => void;
}

export function KnowledgeBaseForm({ initialData, onSubmit, onCancel }: KnowledgeBaseFormProps) {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('text');
    const [textContent, setTextContent] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [faqContent, setFaqContent] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const { toast } = useToast();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<KBFormData>({
        resolver: zodResolver(kbSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
        }
    });

    useEffect(() => {
        if (initialData) {
            setActiveTab(initialData.knowledge_type);
            if (initialData.knowledge_type === 'text') {
                setTextContent(initialData.content || '');
            } else if (initialData.knowledge_type === 'url') {
                setSourceUrl(initialData.source_url || '');
            } else if (initialData.knowledge_type === 'faq') {
                setFaqContent(initialData.content || '');
            }
            if (initialData.file_url) {
                setUploadedFileName('Existing File');
            }
        }
    }, [initialData]);

    const tabConfigs = [
        {
            value: 'text',
            icon: TextCursor,
            label: 'Text',
            description: 'Plain text or markdown',
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            value: 'pdf',
            icon: FileUp,
            label: 'Document',
            description: 'PDF, TXT, or MD files',
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            value: 'url',
            icon: Globe,
            label: 'Website',
            description: 'Scrape web content',
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            value: 'faq',
            icon: MessageSquare,
            label: 'FAQ',
            description: 'Question & Answer format',
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadedFileName(file.name);
        // In a real app we'd extract text, here we just mock
        toast({
            title: 'File selected',
            description: `${file.name} is ready.`,
        });
    };

    const handleFormSubmit = async (data: KBFormData) => {
        setLoading(true);
        try {
            let submitData: any = {
                name: data.name,
                description: data.description,
                knowledge_type: activeTab as any,
            };

            if (activeTab === 'text') submitData.content = textContent;
            else if (activeTab === 'url') submitData.source_url = sourceUrl;
            else if (activeTab === 'faq') submitData.content = faqContent;

            await onSubmit(submitData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Card className="border-border/50 bg-secondary/5">
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold text-foreground">
                            Knowledge Base Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="e.g., Product Documentation"
                            className="bg-background focus:ring-primary/20"
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/5">
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-foreground">Select Content Type</h3>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-transparent h-auto p-0">
                                {tabConfigs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="data-[state=active]:bg-card data-[state=active]:border-primary/50 border border-transparent p-3 flex-col h-auto gap-2 rounded-xl transition-all shadow-sm bg-secondary/20"
                                    >
                                        <div className={`p-2 rounded-lg ${tab.bg}`}>
                                            <tab.icon className={`h-5 w-5 ${tab.color}`} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-xs">{tab.label}</p>
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <div className="mt-6">
                                <TabsContent value="text" className="space-y-3">
                                    <Label className="text-xs font-bold opacity-60">TEXT CONTENT</Label>
                                    <Textarea
                                        className="min-h-[160px] bg-background focus:ring-primary/20 rounded-xl"
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                        placeholder="Paste or type your content here..."
                                    />
                                </TabsContent>

                                <TabsContent value="pdf" className="space-y-3">
                                    <Label className="text-xs font-bold opacity-60">UPLOAD DOCUMENT</Label>
                                    <div className="border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center bg-background/50">
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <Upload className="h-10 w-10 mx-auto text-primary/40 mb-3" />
                                            <p className="text-sm font-bold text-foreground">
                                                {uploadedFileName || 'Click to upload or drag and drop'}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                PDF, TXT, MD, CSV, DOC, DOCX (max 10MB)
                                            </p>
                                        </label>
                                    </div>
                                </TabsContent>

                                <TabsContent value="url" className="space-y-3">
                                    <Label className="text-xs font-bold opacity-60">WEBSITE URL</Label>
                                    <Input
                                        type="url"
                                        value={sourceUrl}
                                        onChange={(e) => setSourceUrl(e.target.value)}
                                        placeholder="https://example.com/docs"
                                        className="bg-background rounded-xl"
                                    />
                                </TabsContent>

                                <TabsContent value="faq" className="space-y-3">
                                    <Label className="text-xs font-bold opacity-60">FAQ CONTENT</Label>
                                    <Textarea
                                        className="min-h-[160px] bg-background focus:ring-primary/20 rounded-xl font-mono text-xs"
                                        value={faqContent}
                                        onChange={(e) => setFaqContent(e.target.value)}
                                        placeholder="Q: What are your business hours?&#10;A: We are open Monday to Friday..."
                                    />
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="font-bold text-muted-foreground hover:bg-secondary"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground font-bold px-6 shadow-md shadow-primary/20 active:scale-95 transition-all"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Plus className="h-4 w-4 mr-2" />
                    )}
                    {initialData ? 'Update Source' : 'Add Knowledge'}
                </Button>
            </div>
        </form>
    );
}
