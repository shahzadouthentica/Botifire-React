import { useState, useMemo } from 'react';
import { Bot, Search, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { isAfter, isBefore, parseISO } from 'date-fns';

import { ChatbotCard, AddChatbotCard, ChatbotType } from '@/components/chatbots/ChatbotCard';
import { ChatbotForm } from '@/components/chatbots/ChatbotForm';

// Initial Mock Bots Data
const INITIAL_BOTS: ChatbotType[] = [
  {
    id: '1',
    name: 'Support Bot',
    description: 'Handles customer support queries',
    status: 'active',
    created_at: new Date(2025, 11, 31).toISOString(),
    voice_name: 'Sarah - Friendly & Professional',
  },
  {
    id: '2',
    name: 'Sales Assistant',
    description: 'Helps users find products and checkout',
    status: 'active',
    created_at: new Date(2025, 11, 21).toISOString(),
    voice_name: 'Michael - Clear & Confident',
  },
  {
    id: '3',
    name: 'FAQ Bot',
    description: 'Answers frequently asked questions',
    status: 'disabled',
    created_at: new Date(2025, 11, 15).toISOString(),
  },
];

export default function Chatbots() {
  const [bots, setBots] = useState<ChatbotType[]>(INITIAL_BOTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateAfter, setDateAfter] = useState<Date | undefined>(undefined);
  const [dateBefore, setDateBefore] = useState<Date | undefined>(undefined);

  // Dialog State
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBot, setEditingBot] = useState<ChatbotType | null>(null);

  // Simulate API calls
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState('');

  const filteredBots = useMemo(() => {
    return bots.filter((bot) => {
      const matchesSearch =
        bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const botDate = bot.created_at ? parseISO(bot.created_at) : null;
      const matchesDateAfter = !dateAfter || (botDate && isAfter(botDate, dateAfter));
      const matchesDateBefore = !dateBefore || (botDate && isBefore(botDate, dateBefore));

      const matchesStatus = statusFilter === 'all' || bot.status === statusFilter;

      return matchesSearch && matchesDateAfter && matchesDateBefore && matchesStatus;
    });
  }, [bots, searchQuery, statusFilter, dateAfter, dateBefore]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateAfter(undefined);
    setDateBefore(undefined);
  };

  const handleCreate = async (data: any) => {
    setIsGenerating(true);
    setGeneratingProgress('Creating your bot...');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newBot: ChatbotType = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description,
      status: data.status,
      created_at: new Date().toISOString(),
      voice_name: data.voice_name,
    };

    setBots((prev) => [newBot, ...prev]);
    setIsGenerating(false);
    setShowCreateDialog(false);
  };

  const handleUpdate = async (data: any) => {
    setBots((prev) =>
      prev.map((bot) =>
        bot.id === editingBot?.id
          ? { ...bot, ...data, voice_name: data.voice_name }
          : bot
      )
    );
    setEditingBot(null);
  };

  const handleDelete = (bot: ChatbotType) => {
    if (confirm(`Are you sure you want to delete ${bot.name}?`)) {
      setBots((prev) => prev.filter((b) => b.id !== bot.id));
    }
  };

  const handleDeploy = (bot: ChatbotType) => {
    alert(`Deploying ${bot.name}...`);
  };

  const handleTest = (bot: ChatbotType) => {
    alert(`Testing ${bot.name}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chatbots</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Create and manage your AI chatbots
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
              <Bot className="h-3 w-3 mr-1" />
              {filteredBots.length} Bots
            </Badge>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search bots by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 transition-all focus:ring-2 focus:ring-primary/20 border-border/50 bg-muted/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="h-3 w-3" />
                  Filters:
                </span>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9 text-xs bg-muted/20 border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <DatePicker
                  date={dateAfter}
                  setDate={setDateAfter}
                  placeholder="Created after"
                  className="w-[145px]"
                />
                <span className="text-muted-foreground text-xs">to</span>
                <DatePicker
                  date={dateBefore}
                  setDate={setDateBefore}
                  placeholder="Created before"
                  className="w-[145px]"
                />
              </div>

              {(searchQuery || statusFilter !== 'all' || dateAfter || dateBefore) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Add Bot Card - Always First */}
        <AddChatbotCard onClick={() => setShowCreateDialog(true)} />

        {filteredBots.map((bot) => (
          <ChatbotCard
            key={bot.id}
            agent={bot}
            onEdit={setEditingBot}
            onDelete={handleDelete}
            onDeploy={handleDeploy}
            onTest={handleTest}
          />
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          if (!open && isGenerating) return;
          setShowCreateDialog(open);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] mx-4 sm:mx-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Bot</DialogTitle>
          </DialogHeader>
          <ChatbotForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateDialog(false)}
            isGenerating={isGenerating}
            generatingProgress={generatingProgress}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingBot}
        onOpenChange={(open) => {
          if (!open) setEditingBot(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] mx-4 sm:mx-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bot</DialogTitle>
          </DialogHeader>
          {editingBot && (
            <ChatbotForm
              initialData={editingBot}
              onSubmit={handleUpdate}
              onCancel={() => setEditingBot(null)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
