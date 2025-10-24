import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role using the has_role function
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Erro",
          description: "Não foi possível verificar permissões de administrador.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      if (!data) {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar o painel administrativo.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Admin auth error:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, loading };
}
