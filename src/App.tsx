import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Doctors from "./pages/Doctors";
import Inventory from "./pages/Inventory";
import QueueManager from "./pages/QueueManager";
import QueueBoard from "./pages/QueueBoard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/registration" element={<Index />} />
<Route path="/queue" element={<QueueManager />} />
<Route path="/doctors" element={<Doctors />} />

          <Route path="/consultation" element={<Index />} />
          <Route path="/lab" element={<Index />} />
          <Route path="/pharmacy" element={<Index />} />
## Removed radiology route

          <Route path="/billing" element={<Index />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/departments/dermatology" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          <Route path="/opd-dermatology" element={<Index />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
