import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <motion.div
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex flex-1 flex-col min-w-0"
      >
        <TopBar title="Dashboard" onMobileMenuToggle={() => setCollapsed(!collapsed)} />
        <main className={cn(
          "flex-1 transition-all duration-300 overflow-x-hidden",
          collapsed 
            ? "p-4 lg:p-36 lg:pt-20 xl:p-52 xl:pt-20" 
            : "p-4 lg:p-24 lg:pt-20 xl:p-32 xl:pt-20"
        )}>
          <div className="animate-fade-in max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
