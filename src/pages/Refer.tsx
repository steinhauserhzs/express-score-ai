import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, Share2, Gift, Users, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";
import QRCode from "react-qr-code";

interface Referral {
  id: string;
  referred_email: string;
  status: string;
  reward_points: number;
  created_at: string;
  accepted_at: string | null;
}

export default function Refer() {
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadReferralData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/auth");
    }
  };

  const loadReferralData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Get referral code
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setReferralCode(profile.referral_code);
      }

      // Get referrals
      const { data: refData, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals(refData || []);
    } catch (error) {
      console.error("Error loading referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createReferral = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "Erro",
        description: "Digite um email válido",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { error } = await supabase
        .from("referrals")
        .insert({
          referrer_id: session.user.id,
          referred_email: newEmail,
          referral_code: referralCode,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Indicação enviada!",
        description: "Seu amigo receberá um convite por email",
      });

      setNewEmail("");
      loadReferralData();
    } catch (error: any) {
      console.error("Error creating referral:", error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "Cole e compartilhe com seus amigos",
    });
  };

  const shareReferralLink = async () => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    const text = `Junte-se a mim na DiagnoFinance e melhore sua saúde financeira! Use meu código: ${referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "DiagnoFinance", text, url: link });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyReferralLink();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">✓ Completo</Badge>;
      case "accepted":
        return <Badge className="bg-blue-500">Em andamento</Badge>;
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalPoints = referrals
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.reward_points, 0);

  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
          <h1 className="text-xl font-bold">Indicar Amigos</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="text-center mb-6">
            <Gift className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-2">Ganhe Recompensas!</h2>
            <p className="text-lg text-muted-foreground">
              Indique amigos e ganhe 300 pontos para cada amigo que completar um diagnóstico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{referrals.length}</div>
              <div className="text-sm text-muted-foreground">Indicações Feitas</div>
            </Card>
            <Card className="p-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">
                {referrals.filter((r) => r.status === "completed").length}
              </div>
              <div className="text-sm text-muted-foreground">Completas</div>
            </Card>
            <Card className="p-4 text-center">
              <Gift className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Pontos Ganhos</div>
            </Card>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Seu Código de Indicação</h3>
          
          <div className="bg-muted p-4 rounded-lg mb-4 text-center">
            <div className="text-3xl font-bold mb-2">{referralCode}</div>
            <div className="flex gap-2 justify-center">
              <Button onClick={copyReferralLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
              <Button onClick={shareReferralLink} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-lg">
              <QRCode value={referralLink} size={200} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Convidar por Email</label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && createReferral()}
              />
              <Button onClick={createReferral}>Enviar Convite</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Suas Indicações</h3>
          
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Você ainda não fez nenhuma indicação</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-medium">{referral.referred_email}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {referral.status === "completed" && (
                      <Badge variant="outline" className="bg-yellow-500/10">
                        +{referral.reward_points} pts
                      </Badge>
                    )}
                    {getStatusBadge(referral.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
