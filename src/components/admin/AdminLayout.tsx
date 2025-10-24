import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminSidebar from "./AdminSidebar";
import Logo from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      
      <div className="flex-1 flex flex-col w-full">
        <header className="h-14 md:h-16 border-b bg-card flex items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <AdminSidebar />
              </SheetContent>
            </Sheet>
            
            <Logo size="sm" showText={!isMobile} />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Desktop: Full text buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToClient}
              className="hidden md:flex gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Visão Cliente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="hidden md:flex gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
            
            {/* Mobile: Icon only buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToClient}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSignOut}
              className="md:hidden"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
