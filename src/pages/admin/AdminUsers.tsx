import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Shield, User, Eye } from "lucide-react";
import RoleManager from "@/components/admin/RoleManager";
import UserDetailModal from "@/components/admin/UserDetailModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<any | null>(null);
  const [filterTab, setFilterTab] = useState<"all" | "admin" | "client">("all");

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      return profiles.map((profile) => ({
        ...profile,
        roles: roles
          ?.filter((r) => r.user_id === profile.id)
          .map((r) => r.role) || [],
      }));
    },
  });

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterTab === "all" ||
      (filterTab === "admin" && user.roles.includes("admin")) ||
      (filterTab === "client" && !user.roles.includes("admin"));

    return matchesSearch && matchesFilter;
  });

  const adminCount = users?.filter((u) => u.roles.includes("admin")).length || 0;
  const clientCount = users?.filter((u) => !u.roles.includes("admin")).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground break-words">
            Gestão de Usuários
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie usuários e suas permissões de acesso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{adminCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários da Plataforma</CardTitle>
            <CardDescription>
              Promova usuários existentes para administradores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="admin">Administradores</TabsTrigger>
                <TabsTrigger value="client">Clientes</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Usuário</TableHead>
                    <TableHead className="whitespace-nowrap">Email</TableHead>
                    <TableHead className="whitespace-nowrap">Roles</TableHead>
                    <TableHead className="hidden md:table-cell whitespace-nowrap">Data de Cadastro</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {user.full_name}
                            {user.id === currentUser?.id && (
                              <Badge variant="outline" className="text-xs">
                                Você
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.roles.includes("admin") ? (
                              <Badge variant="default" className="gap-1">
                                <Shield className="h-3 w-3" />
                                Admin
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <User className="h-3 w-3" />
                                Cliente
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUserForDetail(user)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user.id)}
                            >
                              Gerenciar Roles
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Detalhes do Usuário */}
        <UserDetailModal
          user={selectedUserForDetail}
          open={!!selectedUserForDetail}
          onClose={() => setSelectedUserForDetail(null)}
        />

        {/* RoleManager existente */}
        {selectedUser && (
          <RoleManager
            userId={selectedUser}
            currentUserId={currentUser?.id || ""}
            onClose={() => {
              setSelectedUser(null);
              refetch();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
