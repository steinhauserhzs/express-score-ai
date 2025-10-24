import Testimonial from "@/components/Testimonial";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Empreendedora",
    content: "O diagnóstico foi revelador! Consegui identificar pontos que eu nem sabia que estavam prejudicando minha saúde financeira. Em 3 meses meu score melhorou 45 pontos!",
    rating: 5,
    initials: "MS"
  },
  {
    name: "João Santos",
    role: "Profissional Liberal",
    content: "Sempre achei que estava bem financeiramente, mas o Pleno me mostrou áreas que eu precisava melhorar urgentemente. As recomendações são práticas e fáceis de seguir.",
    rating: 5,
    initials: "JS"
  },
  {
    name: "Ana Costa",
    role: "Gestora de RH",
    content: "Recomendo para toda a minha equipe. A análise é completa e o relatório ajuda muito a ter clareza sobre onde focar os esforços.",
    rating: 5,
    initials: "AC"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quem já transformou sua vida financeira
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Veja o que nossos usuários estão dizendo sobre o Pleno
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Testimonial {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
