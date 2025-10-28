import { ReactNode } from "react";
import Navigation from "./Navigation";
import WhatsAppButton from "./WhatsAppButton";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  showWhatsApp?: boolean;
  showSidebar?: boolean;
}

const Layout = ({ children, showWhatsApp = true, showSidebar = false }: LayoutProps) => {
  const location = useLocation();
  
  // Detectar se está em páginas do dashboard
  const isDashboardPage = location.pathname.startsWith("/dashboard") || 
                          location.pathname === "/goals" ||
                          location.pathname === "/education" ||
                          location.pathname === "/refer" ||
                          location.pathname === "/consultations";

  if (showSidebar || isDashboardPage) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Navigation />
            <main className="flex-1 pt-20">{children}</main>
            {showWhatsApp && <WhatsAppButton />}
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">{children}</main>
      {showWhatsApp && <WhatsAppButton />}
    </div>
  );
};

export default Layout;
