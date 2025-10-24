import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralCardProps {
  referralCode: string;
  referralUrl: string;
}

export default function ReferralCard({ referralCode, referralUrl }: ReferralCardProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência"
    });
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Diagnóstico Financeiro Gratuito",
          text: "Faça seu diagnóstico financeiro gratuito e melhore sua saúde financeira!",
          url: referralUrl
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      copyToClipboard(referralUrl);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Código de Indicação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center p-6 bg-background rounded-lg">
          <QRCode value={referralUrl} size={200} />
        </div>

        <div className="text-center space-y-2">
          <p className="text-2xl font-bold tracking-wider">{referralCode}</p>
          <p className="text-sm text-muted-foreground">
            Compartilhe este código com seus amigos
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => copyToClipboard(referralUrl)}
            variant="outline"
            className="w-full gap-2"
          >
            <Copy className="h-4 w-4" />
            Copiar Link
          </Button>
          <Button onClick={shareReferral} className="w-full gap-2">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Quando alguém usar seu link, vocês dois ganham benefícios exclusivos!
        </div>
      </CardContent>
    </Card>
  );
}
