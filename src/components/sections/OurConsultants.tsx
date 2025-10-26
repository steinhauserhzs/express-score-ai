import { motion } from "framer-motion";
import { Award, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const OurConsultants = () => {
  const consultants = [
    {
      name: "Sidney Proença",
      specialty: "Planejamento Financeiro",
      certifications: ["CFP®", "CGA"],
      initials: "SP",
      description: "Especialista em planejamento financeiro pessoal com foco em aposentadoria",
    },
    {
      name: "Larissa Ferreira",
      specialty: "Investimentos",
      certifications: ["CGA", "CNPI"],
      initials: "LF",
      description: "Consultora especializada em estratégias de investimento e alocação de ativos",
    },
    {
      name: "Igor Felipe",
      specialty: "Educação Financeira",
      certifications: ["CFP®"],
      initials: "IF",
      description: "Educador financeiro com foco em transformação comportamental",
    },
    {
      name: "Marcelo Rosa",
      specialty: "Gestão Patrimonial",
      certifications: ["CFP®", "CGA"],
      initials: "MR",
      description: "Especialista em gestão de patrimônio e sucessão familiar",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/20">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Nossa Equipe
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Consultores Certificados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Profissionais experientes e certificados prontos para transformar sua vida financeira
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {consultants.map((consultant, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full border-border hover:border-primary/50 transition-all hover-lift">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/60 text-white">
                      {consultant.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-bold mb-1">{consultant.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-3">
                    {consultant.specialty}
                  </p>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    {consultant.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold"
                      >
                        <Award className="h-3 w-3" />
                        {cert}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {consultant.description}
                  </p>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Consulta
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground mb-4">
            Todos os nossos consultores são certificados e seguem o código de ética da PLANEJAR
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4 text-primary" />
              Certificados
            </span>
            <span>•</span>
            <span>9+ anos de experiência</span>
            <span>•</span>
            <span>1000+ clientes atendidos</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurConsultants;
