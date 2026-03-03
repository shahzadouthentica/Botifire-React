import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { ThemeProvider } from "./components/theme-provider";
import { AccentColorProvider } from "@/components/providers/AccentColorProvider";

import VoiceAgents from "./pages/VoiceAgents";
import TextualBots from "./pages/TextualBots";
import KnowledgeBase from "./pages/KnowledgeBase";
import Conversations from "./pages/Conversations";
import Analytics from "./pages/Analytics";
import Subscription from "./pages/Subscription";

import { AuthProvider } from "@/hooks/useAuth";
import { WorkspaceProvider } from "@/hooks/useWorkspace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AccentColorProvider>
          <BrowserRouter>
            <AuthProvider>
              <WorkspaceProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/voice-agents" element={<VoiceAgents />} />
                    <Route path="/text-bots" element={<TextualBots />} />
                    <Route path="/knowledge-base" element={<KnowledgeBase />} />
                    <Route path="/conversations" element={<Conversations />} />
                    <Route path="/integrations" element={<Placeholder />} />
                    <Route path="/training" element={<Placeholder />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WorkspaceProvider>
            </AuthProvider>
          </BrowserRouter>
        </AccentColorProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
