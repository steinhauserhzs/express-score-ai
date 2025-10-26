import { ReactNode } from "react";
import Navigation from "./Navigation";
import WhatsAppButton from "./WhatsAppButton";

interface LayoutProps {
  children: ReactNode;
  showWhatsApp?: boolean;
}

const Layout = ({ children, showWhatsApp = true }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">{children}</main>
      {showWhatsApp && <WhatsAppButton />}
    </div>
  );
};

export default Layout;
