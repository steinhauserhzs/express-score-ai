import { Award, Shield, Star, DollarSign, GraduationCap } from "lucide-react";

const badges = [
  {
    icon: Award,
    text: "9 anos de experiência comprovada"
  },
  {
    icon: Shield,
    text: "Dados criptografados e protegidos"
  },
  {
    icon: Star,
    text: "Avaliação 5 estrelas no Google"
  },
  {
    icon: DollarSign,
    text: "R$ 70M sob administração"
  },
  {
    icon: GraduationCap,
    text: "Consultores certificados"
  }
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 max-w-5xl mx-auto">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-3 rounded-full bg-card shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <badge.icon className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
