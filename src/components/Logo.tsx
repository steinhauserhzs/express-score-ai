interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo icon - representando crescimento/evolução financeira */}
      <div className={`${sizes[size]} relative group`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
          {/* Círculo base sólido e visível */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="hsl(158, 64%, 42%)"
            opacity="0.15"
          />
          
          {/* Gráfico de crescimento simplificado e VISÍVEL */}
          <path 
            d="M 20 70 L 30 60 L 40 62 L 50 45 L 60 48 L 70 30 L 80 20" 
            stroke="hsl(158, 64%, 42%)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Área preenchida sob o gráfico */}
          <path 
            d="M 20 70 L 30 60 L 40 62 L 50 45 L 60 48 L 70 30 L 80 20 L 80 80 L 20 80 Z" 
            fill="hsl(158, 64%, 42%)"
            opacity="0.2"
          />
          
          {/* Pontos de destaque VISÍVEIS */}
          <circle cx="20" cy="70" r="3" fill="hsl(158, 64%, 42%)" />
          <circle cx="30" cy="60" r="3" fill="hsl(158, 64%, 42%)" />
          <circle cx="40" cy="62" r="3" fill="hsl(158, 64%, 42%)" />
          <circle cx="50" cy="45" r="4" fill="hsl(142, 76%, 46%)" />
          <circle cx="60" cy="48" r="4" fill="hsl(142, 76%, 46%)" />
          <circle cx="70" cy="30" r="5" fill="hsl(142, 76%, 46%)" />
          <circle cx="80" cy="20" r="6" fill="white" className="drop-shadow-md" />
          
          {/* Seta indicando crescimento */}
          <path 
            d="M 72 26 L 80 20 L 80 28 Z" 
            fill="white"
          />
          <path 
            d="M 80 20 L 86 20 L 80 14 Z" 
            fill="white"
          />
        </svg>
      </div>
      
      {/* Nome da marca */}
      {showText && (
        <span className={`font-bold ${textSizes[size]} text-primary transition-all hover:opacity-90`}>
          Pleno
        </span>
      )}
    </div>
  );
}
