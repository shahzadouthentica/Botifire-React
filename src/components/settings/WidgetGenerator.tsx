import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Code2, Palette, Settings2, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccentColor } from '@/components/providers/AccentColorProvider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function WidgetGenerator() {
  const [selectedAgent, setSelectedAgent] = useState<string>('agent-1');
  const [copied, setCopied] = useState(false);
  const { accentColor } = useAccentColor();
  const accentHex = accentColor.hex || "#A0A9DA";
  
  const [activeSubTab, setActiveSubTab] = useState('customize');

  const [config, setConfig] = useState({
    position: 'right',      // left / right
    bottom: 25,             // px
    primaryColor: accentHex,
    title: 'Voice Assistant',
  });

  // Re-sync primary color if accent color changes globally
  useEffect(() => {
    setConfig(c => ({ ...c, primaryColor: accentHex }));
  }, [accentHex]);

  // Mock deployed agents
  const deployedAgents = [
    { id: 'agent-1', name: 'Customer Support Bot', eid: 'el-7813a' },
    { id: 'agent-2', name: 'Sales Assistant', eid: 'el-4425b' },
  ];

  const selectedAgentData = deployedAgents.find(a => a.id === selectedAgent);

  const generateWidgetCode = () => {
    if (!selectedAgentData) return '';

    return `<script
  src="https://api.agentifire.io/widget/voicebot/widget.js"
  data-agent-id="${selectedAgentData.eid}"
  data-name="${config.title}"
  data-color="${config.primaryColor}"
  data-position="${config.position}"
  data-bottom="${config.bottom}">
</script>`;
  };

  const handleCopy = async () => {
    const code = generateWidgetCode();
    if (!code) return;

    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border/60 shadow-sm rounded-[40px] overflow-hidden bg-white">
      <CardHeader className="px-10 py-8 border-b border-border/40 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white shadow-sm border border-border/40">
            <Code2 className="h-6 w-6" style={{ color: accentHex }} />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Widget Generator</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
              Embed your voice assistant on any website
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-10 space-y-10">
        <div className="space-y-4">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Agent</Label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="h-12 rounded-xl border-border/60 font-bold">
              <SelectValue placeholder="Choose an agent" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              {deployedAgents.map(agent => (
                <SelectItem key={agent.id} value={agent.id} className="font-bold">
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full space-y-8">
          <TabsList className="bg-slate-50 p-1.5 rounded-2xl h-auto flex gap-2 w-full max-w-md">
            <TabsTrigger value="customize" className="flex-1 gap-2 h-10 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md">
               <Palette className="h-3.5 w-3.5" /> Customize
            </TabsTrigger>
            <TabsTrigger value="code" className="flex-1 gap-2 h-10 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md">
               <Settings2 className="h-3.5 w-3.5" /> Code
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeSubTab === 'customize' ? (
              <motion.div
                key="customize"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Position</Label>
                    <Select
                      value={config.position}
                      onValueChange={(v) => setConfig(c => ({ ...c, position: v }))}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-border/60 font-bold font-black"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="right" className="font-bold">Right Side</SelectItem>
                        <SelectItem value="left" className="font-bold">Left Side</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Widget Title</Label>
                    <Input
                      value={config.title}
                      onChange={(e) => setConfig(c => ({ ...c, title: e.target.value }))}
                      className="h-12 rounded-xl border-border/60 font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bottom Offset (px)</Label>
                    <Input
                      type="number"
                      value={config.bottom}
                      onChange={(e) => setConfig(c => ({ ...c, bottom: parseInt(e.target.value) || 0 }))}
                      className="h-12 rounded-xl border-border/60 font-bold"
                      min={0}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Color</Label>
                    <div className="flex gap-4">
                      <Input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig(c => ({ ...c, primaryColor: e.target.value }))}
                        className="h-12 w-20 p-1 cursor-pointer border-border/60 rounded-xl"
                      />
                      <Input
                        value={config.primaryColor.toUpperCase()}
                        readOnly
                        className="h-12 flex-1 rounded-xl bg-slate-50 border-border/40 font-mono font-bold text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview - Premium Style */}
                <div className="pt-6">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Desktop Preview</Label>
                  <div className="border border-border/40 rounded-[32px] p-10 bg-slate-50/50 relative min-h-[300px] overflow-hidden group">
                    {/* Placeholder content to simulate a website */}
                    <div className="space-y-4 opacity-10 select-none">
                       <div className="h-6 w-1/3 bg-slate-400 rounded-lg"></div>
                       <div className="h-4 w-full bg-slate-300 rounded-lg"></div>
                       <div className="h-4 w-5/6 bg-slate-300 rounded-lg"></div>
                       <div className="h-6 w-1/4 bg-slate-400 rounded-lg pt-8"></div>
                       <div className="h-4 w-full bg-slate-300 rounded-lg"></div>
                    </div>

                    <div
                      className="absolute flex items-center justify-center cursor-pointer shadow-2xl rounded-full select-none transition-all duration-500 hover:scale-110 active:scale-95 z-10"
                      style={{
                        [config.position]: '30px',
                        bottom: `${config.bottom}px`,
                        padding: '14px 24px',
                        background: config.primaryColor,
                        boxShadow: `0 15px 35px -5px ${config.primaryColor}50`
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-white mr-2" />
                      <span className="text-white font-black text-xs uppercase tracking-widest">{config.title}</span>
                    </div>

                    <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] italic">
                      Interactive Preview Grid
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Installation Script</Label>
                  <div className="relative group">
                    <Textarea 
                      readOnly 
                      value={generateWidgetCode()} 
                      className="font-mono text-xs h-64 rounded-3xl p-8 bg-slate-900 text-slate-300 border-none leading-relaxed focus:ring-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none rounded-3xl" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 italic">
                    Paste this code right before the closing <code className="text-accent underline">&lt;/body&gt;</code> tag on your website.
                  </p>
                </div>

                <Button 
                  onClick={handleCopy} 
                  className="w-full h-14 rounded-[24px] font-black uppercase tracking-widest text-xs gap-3 shadow-xl transition-all duration-300"
                  style={{ backgroundColor: accentHex, boxShadow: `0 10px 20px -5px ${accentHex}40` }}
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 stroke-[3]" /> Copied Script!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 stroke-[3]" /> Copy Widget Code
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
}
