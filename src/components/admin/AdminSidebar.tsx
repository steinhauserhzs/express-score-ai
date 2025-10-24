import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  BarChart3,
  Shield,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    url: "/admin/leads",
    icon: Users,
  },
  {
    title: "Diagnósticos",
    url: "/admin/diagnostics",
    icon: ClipboardList,
  },
  {
    title: "Consultorias",
    url: "/admin/consultations",
    icon: Calendar,
  },
  {
    title: "Relatórios",
    url: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Insights IA",
    url: "/admin/insights",
    icon: Shield,
  },
  {
    title: "Auditoria",
    url: "/admin/audit",
    icon: Shield,
  },
  {
    title: "Métricas",
    url: "/admin/metrics",
    icon: BarChart3,
  },
  {
    title: "Segmentos",
    url: "/admin/segments",
    icon: Users,
  },
  {
    title: "Usuários",
    url: "/admin/users",
    icon: UserCog,
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <aside className="w-64 lg:w-64 border-r bg-card hidden md:block">
      <div className="p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground break-words">
          Painel Admin
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground">Gestão de Leads</p>
      </div>

      <nav className="px-2 md:px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
