import { motion } from "framer-motion";
import { Award, Target, Eye, Heart, TrendingUp, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutFirece = () => {
  const values = [
    {
      icon: Shield,
      title: "Transparência",
      description: "Clareza total em todas as nossas recomendações e processos",
    },
    {
      icon: Award,
      title: "Educação",
      description: "Capacitamos nossos clientes com conhecimento financeiro real",
    },
    {
      icon: TrendingUp,
      title: "Transformação",
      description: "Mudamos vidas através da educação financeira",
    },
    {
      icon: Heart,
      title: "Compromisso",
      description: "Dedicados ao sucesso financeiro de cada cliente",
    },
  ];

  const stats = [
    { value: "9+", label: "Anos de Mercado" },
    { value: "R$ 70M+", label: "Sob Administração" },
    { value: "1000+", label: "Clientes Atendidos" },
    { value: "98%", label: "Satisfação" },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Sobre a Firece
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Transformando Vidas Através da Educação Financeira
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Há 9 anos, a Firece vem revolucionando a relação das pessoas com o dinheiro através de consultoria especializada e educação financeira de qualidade.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Missão</h3>
                <p className="text-muted-foreground">
                  Transformar a relação das pessoas com o dinheiro através de educação financeira acessível e consultoria personalizada de excelência.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <Eye className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Visão</h3>
                <p className="text-muted-foreground">
                  Ser a referência nacional em educação financeira, impactando milhões de vidas e democratizando o acesso ao conhecimento financeiro de qualidade.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Compromisso</h3>
                <p className="text-muted-foreground">
                  Colocar sempre o cliente em primeiro lugar, oferecendo soluções personalizadas e éticas que realmente transformam realidades financeiras.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-center mb-10">Nossos Valores</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutFirece;
