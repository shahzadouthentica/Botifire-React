import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Code2, Settings as SettingsIcon, Mail, Shield, Sparkles, Loader2 } from 'lucide-react';
import { WidgetGenerator } from '@/components/settings/WidgetGenerator';
import { cn } from '@/lib/utils';
import { useAccentColor } from '@/components/providers/AccentColorProvider';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
    const { signOut } = useAuth();
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const { accentColor } = useAccentColor();
    const accentHex = accentColor.hex || "#A0A9DA";

    // Static/Mock Form states
    const [fullName, setFullName] = useState('Doplexer Solutions');
    const [companyName, setCompanyName] = useState('Doplexer');
    const [phone, setPhone] = useState('+92 300 1234567');
    const email = 'contact@doplexer.com';

    const handleUpdateProfile = async () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
        }, 1000);
    };

    const tabItems = [
        { id: 'profile', label: 'Profile', icon: User, description: 'Manage your personal information' },
        { id: 'widget', label: 'Widget', icon: Code2, description: 'Embed voice agents on your site' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1200px] mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5" style={{ color: accentHex }} />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            Administration
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Settings
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        Manage your account and workspace configurations
                    </p>
                </div>
                <Badge variant="outline" className="px-3 py-1 bg-accent/5 border-accent/20 flex items-center gap-1.5 h-8 rounded-2xl" style={{ color: accentHex }}>
                    <Sparkles className="h-3.5 w-3.5" style={{ color: accentHex }} />
                    <span className="text-[11px] font-bold">Doplexer Workspace</span>
                </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                {/* Tab Navigation - V2 Styled */}
                <Card className="overflow-hidden border-border/60 shadow-sm rounded-3xl">
                    <CardContent className="p-3">
                        <TabsList className="w-full bg-transparent h-auto p-0 flex flex-col sm:flex-row gap-3">
                            {tabItems.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className={cn(
                                        "relative flex-1 flex flex-col items-center gap-2 p-5 rounded-2xl transition-all duration-500",
                                        "data-[state=active]:bg-accent/5 data-[state=active]:shadow-lg data-[state=active]:shadow-accent/5",
                                        "hover:bg-accent/5 group border border-transparent data-[state=active]:border-accent/10"
                                    )}
                                    style={activeTab === tab.id ? { borderColor: `${accentHex}20` } : {}}
                                >
                                    <div className={cn(
                                        "p-3 rounded-xl transition-all duration-500",
                                        activeTab === tab.id
                                            ? "text-white scale-110 shadow-lg"
                                            : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
                                    )}
                                        style={activeTab === tab.id ? { backgroundColor: accentHex, boxShadow: `0 8px 16px -4px ${accentHex}40` } : {}}
                                    >
                                        <tab.icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-0.5 mt-2">
                                        <span className="font-black text-xs uppercase tracking-widest block">{tab.label}</span>
                                        <span className="text-[10px] font-medium text-muted-foreground hidden lg:block opacity-60">
                                            {tab.description}
                                        </span>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </CardContent>
                </Card>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-0 animate-in slide-in-from-bottom-4 duration-700">
                    <Card className="border-border/60 shadow-sm rounded-[40px] overflow-hidden bg-white">
                        <CardHeader className="px-10 py-8 border-b border-border/40 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-white shadow-sm border border-border/40">
                                    <User className="h-6 w-6" style={{ color: accentHex }} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Profile Information</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Workspace Name */}
                                <div className="space-y-3">
                                    <Label htmlFor="workspace-name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Shield className="h-3 w-3" /> Workspace
                                    </Label>
                                    <Input
                                        id="workspace-name"
                                        value="Doplexer Workspace"
                                        disabled
                                        className="h-12 rounded-xl bg-slate-50 cursor-not-allowed font-bold text-slate-600 border-border/40"
                                    />
                                    <p className="text-[10px] font-bold text-slate-400 italic">Static Workspace ID: WS-7813-DOP</p>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Email Address
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            value={email}
                                            disabled
                                            className="h-12 rounded-xl bg-slate-50 cursor-not-allowed font-bold text-slate-600 border-border/40 pr-10"
                                        />
                                        <Shield className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    </div>
                                </div>

                                {/* Name Field */}
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="h-12 rounded-xl border-border/60 focus:ring-2 transition-all font-bold"
                                    />
                                </div>

                                {/* Company Field */}
                                <div className="space-y-3">
                                    <Label htmlFor="company" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name</Label>
                                    <Input
                                        id="company"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Enter your company name"
                                        className="h-12 rounded-xl border-border/60 focus:ring-2 transition-all font-bold"
                                    />
                                </div>

                                {/* Phone Number Field */}
                                <div className="space-y-3 md:col-span-2">
                                    <Label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="h-12 rounded-xl border-border/60 focus:ring-2 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border/40">
                                <Button
                                    disabled={saving}
                                    className="h-12 px-10 rounded-[20px] font-black uppercase tracking-widest text-xs shadow-xl transition-all duration-300"
                                    style={{ backgroundColor: accentHex, boxShadow: `0 10px 20px -5px ${accentHex}40` }}
                                    onClick={handleUpdateProfile}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Update Changes'
                                    )}
                                </Button>
                                <Button variant="outline" className="h-12 px-10 rounded-[20px] font-black uppercase tracking-widest text-xs border-slate-200" onClick={signOut}>
                                    Sign Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Widget Tab */}
                <TabsContent value="widget" className="mt-0 animate-in slide-in-from-bottom-4 duration-700">
                    <WidgetGenerator />
                </TabsContent>
            </Tabs>
        </div>
    );
}
