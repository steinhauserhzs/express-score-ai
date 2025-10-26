import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export function useAuth(requireAuth: boolean = true) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;

        console.log('[Auth] State change:', event, currentSession ? 'has session' : 'no session');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Handle auth events
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          if (requireAuth) {
            navigate("/auth");
          }
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] Token refreshed successfully');
        }

        if (event === 'SIGNED_IN') {
          console.log('[Auth] User signed in:', currentSession?.user?.email);
        }
      }
    );

    // THEN check for existing session
    const initAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth] Error getting session:', error);
          
          // If bad JWT, try to refresh
          if (error.message.includes('bad_jwt') || error.message.includes('invalid claim')) {
            console.log('[Auth] Attempting to refresh session...');
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
              console.error('[Auth] Refresh failed:', refreshError);
              if (requireAuth && mounted) {
                toast({
                  title: "Sessão Expirada",
                  description: "Por favor, faça login novamente.",
                  variant: "destructive",
                });
                navigate("/auth");
              }
            } else if (refreshedSession && mounted) {
              console.log('[Auth] Session refreshed successfully');
              setSession(refreshedSession);
              setUser(refreshedSession.user);
            }
          }
        } else if (currentSession && mounted) {
          setSession(currentSession);
          setUser(currentSession.user);
          console.log('[Auth] Session loaded:', currentSession.user?.email);
        } else if (!currentSession && requireAuth && mounted) {
          console.log('[Auth] No session found, redirecting to auth');
          navigate("/auth");
        }
      } catch (error) {
        console.error('[Auth] Init error:', error);
        if (requireAuth && mounted) {
          navigate("/auth");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth, toast]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('[Auth] User signed out');
      navigate("/auth");
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
      toast({
        title: "Erro ao Sair",
        description: "Não foi possível desconectar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return { user, session, loading, signOut };
}
