import { useState, useCallback, useEffect } from 'react';
import { Check, X, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/hooks/useSubscription';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useAccentColor } from '@/components/providers/AccentColorProvider';

export default function Subscription() {
    const { plans, status, loading, actionLoading, subscribe } = useSubscription();
    const [yearly, setYearly] = useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', skipSnaps: false });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const { accentColor } = useAccentColor();
    const accentHex = accentColor.hex || "#A0A9DA";

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: accentHex }}></div>
            </div>
        );
    }

    const currentPlanId = status?.subscription_plan_id;

    const featureKeys = [
        'Voice Agents',
        'Text Agents',
        'Knowledge Bases',
        'Monthly Credits',
        'Conversations/month',
        'WhatsApp Integration',
        'Custom Voices',
        'Priority Support',
        'API Access',
        'Team Members',
        'Analytics',
    ];

    const getFeatureValue = (plan: any, key: string) => {
        const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : (plan.features || []);
        const feature = features.find((f: any) => f.title === key);
        return feature;
    };

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700 max-w-[1400px] mx-auto px-4">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200 p-8 md:p-12 text-center">
                <div className="absolute top-0 right-0 -m-8 h-64 w-64 rounded-full blur-3xl opacity-20" style={{ backgroundColor: accentHex }} />
                <div className="absolute bottom-0 left-0 -m-8 h-48 w-48 rounded-full blur-3xl opacity-30" style={{ backgroundColor: accentHex }} />

                <div className="relative space-y-4 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
                        style={{ backgroundColor: `${accentHex}10`, color: accentHex, borderColor: `${accentHex}20` }}
                    >
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider italic">Elevate Your Agents</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-[900] tracking-tight text-slate-900"
                    >
                        Powerful Plans for <span className="italic" style={{ color: accentHex }}>Scale</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 font-medium"
                    >
                        Choose the perfect plan to boost your productivity. From hobbyists to global enterprises, we have you covered.
                    </motion.p>
                </div>

                {/* Billing Toggle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 flex items-center justify-center gap-6"
                >
                    <span className={cn(
                        "text-sm font-black uppercase tracking-widest transition-colors",
                        !yearly ? "text-slate-900" : "text-slate-400"
                    )} style={!yearly ? { color: accentHex } : {}}>
                        Monthly
                    </span>
                    <div className="bg-slate-200 p-1.5 rounded-full border border-slate-300">
                        <Switch
                            checked={yearly}
                            onCheckedChange={setYearly}
                            className="h-6 w-12 data-[state=checked]:bg-slate-900"
                            style={yearly ? { backgroundColor: accentHex } : {}}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-sm font-black uppercase tracking-widest transition-colors",
                            yearly ? "text-slate-900" : "text-slate-400"
                        )} style={yearly ? { color: accentHex } : {}}>
                            Yearly
                        </span>
                        <Badge variant="secondary" className="text-white border-none px-3 py-1 font-black animate-pulse shadow-lg" style={{ backgroundColor: accentHex, boxShadow: `0 10px 20px -5px ${accentHex}40` }}>
                            Save 20%
                        </Badge>
                    </div>
                </motion.div>
            </div>

            {/* Plan Cards Carousel */}
            <div className="relative group px-4">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6 py-4">
                        {plans.map((plan, index) => {
                            const currentPlanIndex = plans.findIndex(p => p.id === currentPlanId);
                            const isCurrent = currentPlanId === plan.id;
                            const isLower = currentPlanIndex !== -1 && index < currentPlanIndex;
                            const price = yearly ? plan.yearly_price : plan.price;
                            const isEnterprise = plan.name.toLowerCase() === 'enterprise' || plan.name.toLowerCase() === 'custom';
                            const isPopular = plan.name.toLowerCase() === 'pro';

                            return (
                                <div key={plan.id} className="flex-[0_0_100%] sm:flex-[0_0_48%] lg:flex-[0_0_24%] min-w-0">
                                    <Card className={cn(
                                        "relative h-full transition-all duration-300 border-slate-200 shadow-sm bg-white rounded-[32px] overflow-hidden flex flex-col",
                                        isPopular && "shadow-lg -translate-y-1"
                                    )} style={isPopular ? { borderColor: `${accentHex}50`, ring: `1px solid ${accentHex}20` } : {}}>
                                        {isPopular && (
                                            <div className="absolute top-0 right-0">
                                                <div className="text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-2xl shadow-xl" style={{ backgroundColor: accentHex, boxShadow: `0 10px 20px -5px ${accentHex}40` }}>
                                                    Popular
                                                </div>
                                            </div>
                                        )}
                                        <CardHeader className="p-8 pb-4">
                                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{plan.name}</CardTitle>
                                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mt-2 h-[60px] line-clamp-3">
                                                {plan.description}
                                            </p>
                                            <div className="pt-8">
                                                {!isEnterprise ? (
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-4xl font-black text-slate-900 tracking-tighter">${price.toFixed(2)}</span>
                                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">/month</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-4xl font-black text-slate-900 tracking-tighter">Custom</span>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-4 space-y-8 flex-1">
                                            <Button
                                                className={cn(
                                                    "w-full font-black h-12 transition-all duration-300 rounded-[20px] text-xs uppercase tracking-widest",
                                                    (isCurrent || isLower)
                                                        ? "bg-slate-100 text-slate-400 cursor-default border-slate-200"
                                                        : isPopular
                                                            ? "text-white shadow-xl"
                                                            : "bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-800"
                                                )}
                                                style={isPopular && !(isCurrent || isLower) ? { backgroundColor: accentHex, boxShadow: `0 10px 20px -5px ${accentHex}40` } : {}}
                                                onClick={() => !(isCurrent || isLower) && subscribe(plan.id)}
                                                disabled={actionLoading}
                                            >
                                                {(isCurrent || isLower) && <Check className="mr-2 h-4 w-4 stroke-[3]" />}
                                                {isCurrent ? "Current plan" : isLower ? "Subscribed" : isEnterprise ? "Contact Sales" : "Upgrade"}
                                            </Button>

                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest italic" style={{ color: accentHex }}>
                                                <Zap className="h-4 w-4 fill-current" />
                                                <span>{plan.monthly_credits?.toLocaleString() || 'Custom'} credits/month</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Carousel Navigation */}
                {plans.length > 4 && (
                    <>
                        <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                                "absolute -left-6 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-xl border-slate-200 h-12 w-12 transition-opacity z-10",
                                !prevBtnEnabled && "opacity-0 pointer-events-none"
                            )}
                            onClick={scrollPrev}
                        >
                            <ChevronLeft className="h-5 w-5 text-slate-400" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                                "absolute -right-6 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-xl border-slate-200 h-12 w-12 transition-opacity z-10",
                                !nextBtnEnabled && "opacity-0 pointer-events-none"
                            )}
                            onClick={scrollNext}
                        >
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                        </Button>
                    </>
                )}
            </div>

            {/* Feature Comparison Table */}
            <div className="space-y-8 px-4">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em] italic text-center">Feature Comparison</h2>
                <Card className="border-slate-200 shadow-sm overflow-hidden rounded-[40px] bg-white">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                                        <th className="text-left py-6 px-10 border-r border-slate-100">Feature</th>
                                        {plans.map((plan) => (
                                            <th key={plan.id} className="text-center py-6 px-6 font-black text-slate-900">
                                                {plan.name.toUpperCase()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {featureKeys.map((featureKey) => (
                                        <tr key={featureKey} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 px-10 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-r border-slate-50 group-hover:text-slate-900 transition-colors">
                                                {featureKey}
                                            </td>
                                            {plans.map((plan) => {
                                                const feature = getFeatureValue(plan, featureKey);
                                                return (
                                                    <td key={plan.id} className="text-center py-4 px-6">
                                                        {!feature ? (
                                                            <span className="text-slate-200">—</span>
                                                        ) : feature.available ? (
                                                            feature.value ? (
                                                                <span className="font-black text-slate-900 text-xs tracking-tight">{featureKey === 'Analytics' ? feature.value.toUpperCase() : feature.value}</span>
                                                            ) : (
                                                                <Check className="h-4 w-4 mx-auto stroke-[4]" style={{ color: accentHex }} />
                                                            )
                                                        ) : (
                                                            <X className="h-4 w-4 text-slate-200 mx-auto stroke-[2]" />
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
