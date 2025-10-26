import { useEffect, useRef, useState } from "react";
import { Users, TrendingUp, Award, DollarSign } from "lucide-react";

interface StatItemProps {
  icon: React.ElementType;
  value: string;
  label: string;
  suffix?: string;
}

function StatItem({ icon: Icon, value, label, suffix = "" }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targetValue = parseInt(value.replace(/\D/g, ""));
    const duration = 2000;
    const steps = 60;
    const increment = targetValue / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const displayValue = value.startsWith("R$") 
    ? `R$ ${count}M` 
    : value.includes("+") 
    ? `${count}+` 
    : `${count}${suffix}`;

  return (
    <div ref={elementRef} className="text-center animate-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {displayValue}
      </div>
      <p className="text-white/80 drop-shadow-sm font-medium">{label}</p>
    </div>
  );
}

export default function Stats() {
  const stats = [
    {
      icon: Users,
      value: "1000+",
      label: "Clientes Atendidos"
    },
    {
      icon: DollarSign,
      value: "R$ 70M",
      label: "Sob Administração"
    },
    {
      icon: Award,
      value: "9",
      label: "Anos de Experiência",
      suffix: " anos"
    },
    {
      icon: TrendingUp,
      value: "300",
      label: "Crescimento Anual",
      suffix: "%"
    }
  ];

  return (
    <section className="py-20 bg-gradient-diagonal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
          Nossos Números Falam Por Si
        </h2>
        <p className="text-white/90 drop-shadow-md max-w-2xl mx-auto">
          Anos de dedicação transformando vidas financeiras com resultados comprovados
        </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatItem {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
