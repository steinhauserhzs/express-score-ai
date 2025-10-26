import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const Blog = () => {
  // Blog posts de exemplo - em produção, viriam de um CMS ou banco de dados
  const posts = [
    {
      id: 1,
      title: "Como Sair das Dívidas: Um Guia Completo e Prático",
      excerpt: "Descubra as estratégias mais eficazes para quitar suas dívidas e retomar o controle da sua vida financeira.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
      author: "Igor Felipe",
      date: "15 de Janeiro, 2025",
      category: "Educação Financeira"
    },
    {
      id: 2,
      title: "Investimentos para Iniciantes: Por Onde Começar?",
      excerpt: "Entenda os primeiros passos no mundo dos investimentos e como construir um portfolio sólido desde o início.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      author: "Marcelo Rosa",
      date: "12 de Janeiro, 2025",
      category: "Investimentos"
    },
    {
      id: 3,
      title: "Reserva de Emergência: Quanto Você Precisa Ter?",
      excerpt: "Calcule o valor ideal da sua reserva de emergência e saiba onde investir esse dinheiro com segurança.",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop",
      author: "Larissa Ferreira",
      date: "08 de Janeiro, 2025",
      category: "Planejamento"
    },
    {
      id: 4,
      title: "Aposentadoria aos 40: É Possível?",
      excerpt: "Conheça o movimento FIRE (Financial Independence, Retire Early) e como aplicá-lo à realidade brasileira.",
      image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&h=400&fit=crop",
      author: "Sidney Proença",
      date: "05 de Janeiro, 2025",
      category: "Planejamento"
    },
    {
      id: 5,
      title: "5 Erros Comuns que Destroem seu Orçamento",
      excerpt: "Identifique e elimine os principais vilões do seu orçamento mensal com dicas práticas e eficazes.",
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=400&fit=crop",
      author: "Igor Felipe",
      date: "02 de Janeiro, 2025",
      category: "Educação Financeira"
    },
    {
      id: 6,
      title: "Renda Fixa vs Renda Variável: Qual é Melhor?",
      excerpt: "Compare as características, riscos e retornos de cada tipo de investimento para tomar decisões mais inteligentes.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      author: "Marcelo Rosa",
      date: "28 de Dezembro, 2024",
      category: "Investimentos"
    }
  ];

  const categories = ["Todos", "Educação Financeira", "Investimentos", "Planejamento", "Mercado Financeiro"];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Blog Firece
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            Conteúdo de qualidade sobre educação financeira, investimentos e planejamento 
            para transformar sua relação com o dinheiro.
          </p>
        </div>
      </section>

      {/* Filtros de Categoria */}
      <section className="py-8 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Todos" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Posts */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="hover-scale overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/70 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-foreground/60">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full group">
                    Ler Artigo
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Não Perca Nenhum Conteúdo
          </h2>
          <p className="text-foreground/70 mb-8">
            Receba nossos melhores artigos, dicas e novidades diretamente no seu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground"
            />
            <Button size="lg">
              Inscrever-se
            </Button>
          </div>
          <p className="text-xs text-foreground/50 mt-4">
            Sem spam. Apenas conteúdo de qualidade. Cancele quando quiser.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
