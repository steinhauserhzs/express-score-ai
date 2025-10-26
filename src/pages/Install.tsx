import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Smartphone, Zap, Wifi, Bell, Check, Share, Plus } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useAnalytics } from "@/hooks/useAnalytics";

const Install = () => {
  const navigate = useNavigate();
  const { canInstall, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("install_page_viewed", "engagement", {});
  }, [trackEvent]);

  const handleInstall = async () => {
    trackEvent("install_page_button_clicked", "conversion", {});
    const installed = await promptInstall();
    
    if (installed) {
      trackEvent("pwa_installed", "conversion", { method: "install_page" });
    }
  };

  if (isInstalled) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-md text-center">
            <div className="bg-success/10 text-success w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-4">App Já Instalado!</h1>
            <p className="text-muted-foreground mb-8">
              Você já tem o app Firece instalado. Acesse pelo ícone na sua tela inicial.
            </p>
            <Button onClick={() => navigate("/")} size="lg">
              Voltar ao Início
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen px-4 py-20">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-16">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Instale o App Firece
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tenha sua consultoria financeira sempre à mão. Funciona offline e carrega
            instantaneamente!
          </p>

          {canInstall && !isIOS && (
            <Button onClick={handleInstall} size="lg" className="text-lg px-8 py-6">
              <Smartphone className="mr-2 w-5 h-5" />
              Instalar Agora
            </Button>
          )}
        </section>

        {/* Benefits Grid */}
        <section className="max-w-5xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Acesso Instantâneo</h3>
              <p className="text-sm text-muted-foreground">
                Abra com um toque na tela inicial
              </p>
            </div>

            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Funciona Offline</h3>
              <p className="text-sm text-muted-foreground">
                Acesse seus dados sem internet
              </p>
            </div>

            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Notificações</h3>
              <p className="text-sm text-muted-foreground">
                Receba alertas personalizados
              </p>
            </div>

            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Como App Nativo</h3>
              <p className="text-sm text-muted-foreground">
                Experiência completa de aplicativo
              </p>
            </div>
          </div>
        </section>

        {/* iOS Instructions */}
        {isIOS && (
          <section className="max-w-2xl mx-auto mb-16">
            <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Como Instalar no iPhone/iPad
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Toque no ícone de Compartilhar</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      Procure pelo ícone <Share className="w-4 h-4 inline" /> (caixa com seta para cima) 
                      na barra inferior do Safari
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Selecione "Adicionar à Tela de Início"</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      Role para baixo e toque na opção <Plus className="w-4 h-4 inline" /> 
                      "Adicionar à Tela de Início"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Confirme a instalação</p>
                    <p className="text-sm text-muted-foreground">
                      Toque em "Adicionar" no canto superior direito. Pronto!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Bottom */}
        <section className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Instale agora e tenha o poder da consultoria financeira no seu bolso.
            </p>
            
            {canInstall && !isIOS ? (
              <Button 
                onClick={handleInstall} 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                <Smartphone className="mr-2 w-5 h-5" />
                Instalar App Firece
              </Button>
            ) : (
              <Button 
                onClick={() => navigate("/")} 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                Voltar ao Início
              </Button>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Install;
