import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RoleManagerProps {
  userId: string;
  currentUserId: string;
  onClose: () => void;
}

export default function RoleManager({ userId, currentUserId, onClose }: RoleManagerProps) {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<"promote" | "demote" | null>(null);

  const isSelf = userId === currentUserId;

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-details", userId],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      const hasAdminRole = roles?.some((r) => r.role === "admin") || false;
      setIsAdmin(hasAdminRole);

      return { profile, hasAdminRole };
    },
  });

  const handleSave = async () => {
    if (isSelf && !isAdmin && user?.hasAdminRole) {
      toast({
        title: "Ação Bloqueada",
        description: "Você não pode remover seu próprio acesso de administrador.",
        variant: "destructive",
      });
      return;
    }

    if (isAdmin === user?.hasAdminRole) {
      onClose();
      return;
    }

    if (isAdmin && !user?.hasAdminRole) {
      setShowConfirmation("promote");
    } else if (!isAdmin && user?.hasAdminRole) {
      setShowConfirmation("demote");
    }
  };

  const confirmAction = async () => {
    setIsSaving(true);
    try {
      const action = isAdmin ? "add" : "remove";
      
      const { error } = await supabase.functions.invoke("manage-user-role", {
        body: {
          targetUserId: userId,
          action,
          role: "admin",
        },
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Permissões atualizadas com sucesso.`,
      });

      onClose();
    } catch (error: any) {
      console.error("Error managing role:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar as permissões.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setShowConfirmation(null);
    }
  };

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showConfirmation) {
    return (
      <Dialog open onOpenChange={() => setShowConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Alteração</DialogTitle>
            <DialogDescription>
              {showConfirmation === "promote"
                ? `Tem certeza que deseja tornar ${user?.profile?.full_name} um administrador? Ele terá acesso total ao painel administrativo.`
                : `Tem certeza que deseja remover ${user?.profile?.full_name} dos administradores? Ele perderá o acesso ao painel administrativo.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(null)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={confirmAction} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões</DialogTitle>
          <DialogDescription>
            Altere as permissões de {user?.profile?.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isSelf && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Você está editando suas próprias permissões. Não é possível remover seu
                próprio acesso de administrador.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label className="text-base font-semibold">Roles Disponíveis</Label>
            <div className="flex items-center space-x-2 rounded-lg border p-4">
              <Checkbox
                id="admin"
                checked={isAdmin}
                onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
                disabled={isSelf && user?.hasAdminRole}
              />
              <Label
                htmlFor="admin"
                className="flex items-center gap-2 font-normal cursor-pointer"
              >
                <Shield className="h-4 w-4 text-primary" />
                Administrador
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Administradores têm acesso total ao painel administrativo e podem gerenciar
              outros usuários.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
