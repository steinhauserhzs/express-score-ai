import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { PWAErrorBoundary } from "@/components/PWAErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminChoice from "./pages/AdminChoice";
import Dashboard from "./pages/Dashboard";
import Diagnostic from "./pages/Diagnostic";
import DiagnosticResults from "./pages/DiagnosticResults";
import Consultations from "./pages/Consultations";
import Education from "./pages/Education";
import Refer from "./pages/Refer";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminDiagnostics from "./pages/admin/AdminDiagnostics";
import AdminConsultations from "./pages/admin/AdminConsultations";
import AdminReports from "./pages/admin/AdminReports";
import AdminInsights from "./pages/admin/AdminInsights";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminMetrics from "./pages/admin/AdminMetrics";
import AdminSegments from "./pages/admin/AdminSegments";
import AdminUsers from "./pages/admin/AdminUsers";
import MyJourney from "./pages/MyJourney";
import Goals from "./pages/Goals";
import Pricing from "./pages/Pricing";
import Calculators from "./pages/Calculators";
import Services from "./pages/Services";
import CodeCapital from "./pages/CodeCapital";
import KeyAccount from "./pages/KeyAccount";
import Partnerships from "./pages/Partnerships";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Install from "./pages/Install";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PWAErrorBoundary>
          <PWAInstallPrompt />
          <PWAInstallButton />
        </PWAErrorBoundary>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/code-capital" element={<CodeCapital />} />
          <Route path="/key-account" element={<KeyAccount />} />
          <Route path="/parcerias" element={<Partnerships />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/trabalhe-conosco" element={<Careers />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="/instalar" element={<Install />} />
          <Route path="/admin-choice" element={<ProtectedRoute><AdminChoice /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/diagnostic" element={<ProtectedRoute><Diagnostic /></ProtectedRoute>} />
          <Route path="/diagnostic/results/:id" element={<ProtectedRoute><DiagnosticResults /></ProtectedRoute>} />
          <Route path="/consultations" element={<ProtectedRoute><Consultations /></ProtectedRoute>} />
          <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
          <Route path="/refer" element={<ProtectedRoute><Refer /></ProtectedRoute>} />
          <Route path="/my-journey" element={<ProtectedRoute><MyJourney /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
          <Route path="/admin/diagnostics" element={<ProtectedRoute><AdminDiagnostics /></ProtectedRoute>} />
          <Route path="/admin/consultations" element={<ProtectedRoute><AdminConsultations /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/insights" element={<ProtectedRoute><AdminInsights /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute><AdminAudit /></ProtectedRoute>} />
          <Route path="/admin/metrics" element={<ProtectedRoute><AdminMetrics /></ProtectedRoute>} />
          <Route path="/admin/segments" element={<ProtectedRoute><AdminSegments /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
