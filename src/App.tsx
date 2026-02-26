import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Chatbots from "./pages/Chatbots";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/chatbots" element={<Chatbots />} />
            <Route path="/visitors" element={<Placeholder />} />
            <Route path="/conversations" element={<Placeholder />} />
            <Route path="/integrations" element={<Placeholder />} />
            <Route path="/training" element={<Placeholder />} />
            <Route path="/voice-bot" element={<Placeholder />} />
            <Route path="/reports" element={<Placeholder />} />
            <Route path="/billing" element={<Placeholder />} />
            <Route path="/settings" element={<Placeholder />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
