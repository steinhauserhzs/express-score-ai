import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "./AdminSidebar";
import Logo from "@/components/Logo";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleBackToClient = () => {
    navigate("/dashboard");
    toast({
      title: "Modo Cliente",
      description: "Você voltou para a visão de cliente.",
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <Logo />
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToClient}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Visão Cliente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
