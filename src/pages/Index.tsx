import { ArrowUpRight, ArrowDownRight, MessageSquare, Users, DollarSign, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Total Messages", value: "12,847", change: "+12.5%", up: true, icon: MessageSquare },
  { label: "Active Users", value: "2,451", change: "+8.2%", up: true, icon: Users },
  { label: "Cost", value: "$342.50", change: "-3.1%", up: false, icon: DollarSign },
  { label: "Avg. Latency", value: "245ms", change: "-15.4%", up: true, icon: Clock },
];

const chartData = [
  { name: "Jan", messages: 2400 },
  { name: "Feb", messages: 1398 },
  { name: "Mar", messages: 4800 },
  { name: "Apr", messages: 3908 },
  { name: "May", messages: 4800 },
  { name: "Jun", messages: 3800 },
  { name: "Jul", messages: 5300 },
];

const trafficSources = [
  { label: "Website", value: 65 },
  { label: "WhatsApp", value: 25 },
  { label: "Voice", value: 10 },
];

const recentConversations = [
  { user: "John D.", message: "How do I reset my password?", time: "2m ago", status: "Active" },
  { user: "Sarah M.", message: "I need help with billing", time: "5m ago", status: "Resolved" },
  { user: "Alex K.", message: "Product availability question", time: "12m ago", status: "Active" },
  { user: "Emma W.", message: "Shipping status update", time: "18m ago", status: "Resolved" },
];

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className="p-2 rounded-lg bg-secondary">
                <stat.icon size={16} className="text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span
                className={`flex items-center text-xs font-medium ${
                  stat.up ? "text-accent" : "text-destructive"
                }`}
              >
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Usage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="msgGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                fill="url(#msgGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-6">Traffic Sources</h3>
          <div className="space-y-5">
            {trafficSources.map((source) => (
              <div key={source.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{source.label}</span>
                  <span className="font-medium text-foreground">{source.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-accent transition-all"
                    style={{ width: `${source.value}%`, opacity: source.value > 50 ? 1 : 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Conversations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">User</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Message</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Time</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentConversations.map((conv, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{conv.user}</td>
                  <td className="py-3 px-2 text-muted-foreground">{conv.message}</td>
                  <td className="py-3 px-2 text-muted-foreground">{conv.time}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        conv.status === "Active"
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {conv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Index;
