import { useLocation } from "react-router-dom";

const Placeholder = () => {
  const location = useLocation();
  const pageName = location.pathname.slice(1).replace(/-/g, " ");

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-2xl border border-border bg-card p-12">
        <h2 className="text-lg font-semibold text-foreground capitalize">{pageName || "Page"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">This section is coming soon.</p>
      </div>
    </div>
  );
};

export default Placeholder;
