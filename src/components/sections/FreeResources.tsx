import { motion } from "framer-motion";
import { FileText, Calculator, Video, Download, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FreeResources = () => {
  const resources = [
    {
      icon: FileText,
      title: "eBooks Gratuitos",
      description: "Guias completos sobre planejamento financeiro, investimentos e educação financeira",
      items: ["Guia de Orçamento Pessoal", "Como Sair das Dívidas", "Primeiros Passos nos Investimentos"],
    },
    {
      icon: Calculator,
      title: "Calculadoras Financeiras",
      description: "Ferramentas interativas para planejar sua vida financeira",
      items: ["Independência Financeira", "Juros Compostos", "Aposentadoria"],
    },
    {
      icon: Video,
      title: "Vídeos Educativos",
      description: "Conteúdo em vídeo sobre os principais temas financeiros",
      items: ["Série: Fundamentos", "Dicas Rápidas", "Entrevistas com Especialistas"],
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Recursos Gratuitos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Aprenda Gratuitamente
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acesse materiais exclusivos desenvolvidos pela Firece para acelerar sua jornada financeira
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <resource.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {resource.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {resource.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group">
                    Acessar
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA para mais recursos */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="inline-block border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Quer Acesso a Todos os Recursos?
                </h3>
                <p className="text-muted-foreground">
                  Faça seu cadastro gratuito e tenha acesso completo a todos os materiais educacionais da Firece
                </p>
              </div>
              <Button size="lg" className="shrink-0">
                <Download className="mr-2 h-5 w-5" />
                Cadastrar Grátis
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeResources;
