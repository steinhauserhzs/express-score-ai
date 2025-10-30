import Testimonial from "@/components/Testimonial";
import { Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const testimonials = [
  {
    name: "Márcia Dsn",
    role: "Cliente Firece",
    content: "Iniciei a consultoria há pouco tempo e já consegui visualizar uma mudança na vida financeira. Meu consultor Sidney Proença é um excelente profissional, super atencioso e preparado. Recomendo!",
    rating: 5,
    initials: "MD"
  },
  {
    name: "Matias Boledi",
    role: "Cliente Firece",
    content: "Sempre me considerei um cara cético com respeito a consultorias. Me mostraram como podia realmente fazer diferenças significantes na minha vida. Extremamente profissionais e atenciosos.",
    rating: 5,
    initials: "MB"
  },
  {
    name: "Gabryel Correa",
    role: "Cliente Firece",
    content: "Um lugar excelente com consultores exemplares, a consultora Larissa Ferreira abriu meu olhos para coisas que eu nem imaginava. Super recomendo!",
    rating: 5,
    initials: "GC"
  },
  {
    name: "Rafael Santos",
    role: "Cliente Firece",
    content: "A Firece mudou completamente minha visão sobre dinheiro. Em 6 meses consegui organizar minhas dívidas e começar a investir. Equipe excepcional!",
    rating: 5,
    initials: "RS"
  },
  {
    name: "Ana Paula Lima",
    role: "Cliente Firece",
    content: "Melhor decisão que tomei! O diagnóstico foi super detalhado e as consultorias me ajudaram a conquistar minha independência financeira. Gratidão à toda equipe!",
    rating: 5,
    initials: "AL"
  },
  {
    name: "Carlos Eduardo",
    role: "Cliente Firece",
    content: "Profissionalismo e dedicação incomparáveis. Consegui aumentar minha reserva de emergência em 200% em menos de 1 ano. Obrigado Firece!",
    rating: 5,
    initials: "CE"
  }
];

export default function Testimonials() {
  const plugin = useRef(
    Autoplay({ 
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-semibold text-lg">Avaliações do Google</span>
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 fill-primary text-primary" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Quem já transformou sua vida financeira
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Veja o que nossos clientes reais estão dizendo sobre a Firece
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
          plugins={[plugin.current]}
          className="w-full max-w-7xl mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Testimonial {...testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="text-center mt-8 animate-fade-in">
          <a
            href="https://www.google.com/search?q=firece+consultoria+financeira"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Ver mais avaliações no Google
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
