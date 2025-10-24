import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  BarChart3,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r bg-card">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground">Painel Admin</h2>
        <p className="text-sm text-muted-foreground">Gestão de Leads</p>
      </div>

      <nav className="px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
