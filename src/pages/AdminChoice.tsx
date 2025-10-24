import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, LayoutDashboard, Shield } from "lucide-react";
import Logo from "@/components/Logo";

export default function AdminChoice() {
  const navigate = useNavigate();

  const choices = [
    {
      title: "Fazer Diagnóstico Gratuito",
      description: "Realize um diagnóstico financeiro completo",
      icon: ClipboardList,
      action: () => navigate("/diagnostic"),
      variant: "default" as const,
    },
    {
      title: "Área do Cliente",
      description: "Acesse seu dashboard pessoal",
      icon: LayoutDashboard,
      action: () => navigate("/dashboard"),
      variant: "secondary" as const,
    },
    {
      title: "Painel Administrativo",
      description: "Gerencie usuários e visualize métricas",
      icon: Shield,
      action: () => navigate("/admin"),
      variant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo, Administrador</h1>
          <p className="text-muted-foreground">Escolha como deseja continuar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {choices.map((choice) => {
            const Icon = choice.icon;
            return (
              <Card key={choice.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-center">{choice.title}</CardTitle>
                  <CardDescription className="text-center">
                    {choice.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={choice.variant}
                    className="w-full"
                    onClick={choice.action}
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
