import { Home, TrendingUp, Target, BookOpen, Users, Settings, Calendar, ChevronLeft } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "./Logo";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Minha Evolução", url: "/dashboard/evolution", icon: TrendingUp },
  { title: "Minhas Metas", url: "/goals", icon: Target },
  { title: "Educação", url: "/education", icon: BookOpen },
  { title: "Indicar Amigos", url: "/refer", icon: Users },
  { title: "Agendar Consultoria", url: "/consultations", icon: Calendar },
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <Logo />}
        <SidebarTrigger className={collapsed ? "mx-auto" : ""}>
          <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </SidebarTrigger>
      </div>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
