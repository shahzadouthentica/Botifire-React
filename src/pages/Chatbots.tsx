import { Plus, MoreVertical, Bot } from "lucide-react";

const bots = [
  { name: "Support Bot", type: "Text", status: "Active" },
  { name: "Sales Assistant", type: "Voice", status: "Active" },
  { name: "FAQ Bot", type: "Text", status: "Inactive" },
];

const Chatbots = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Chatbots</h2>
        <button className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} />
          New Bot
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add Bot Card */}
        <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card p-8 text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors">
          <Plus size={24} />
          <span className="text-sm font-medium">Create New Bot</span>
        </button>

        {bots.map((bot) => (
          <div key={bot.name} className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-secondary">
                  <Bot size={18} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{bot.name}</p>
                  <p className="text-xs text-muted-foreground">{bot.type}</p>
                </div>
              </div>
              <button className="p-1 rounded-md hover:bg-secondary text-muted-foreground">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  bot.status === "Active"
                    ? "bg-accent/10 text-accent"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {bot.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbots;
