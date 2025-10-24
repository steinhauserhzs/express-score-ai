import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Diagnostic from "./pages/Diagnostic";
import Consultations from "./pages/Consultations";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminDiagnostics from "./pages/admin/AdminDiagnostics";
import AdminConsultations from "./pages/admin/AdminConsultations";
import AdminReports from "./pages/admin/AdminReports";
import AdminInsights from "./pages/admin/AdminInsights";
import AdminAudit from "./pages/admin/AdminAudit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/diagnostics" element={<AdminDiagnostics />} />
          <Route path="/admin/consultations" element={<AdminConsultations />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/insights" element={<AdminInsights />} />
          <Route path="/admin/audit" element={<AdminAudit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
