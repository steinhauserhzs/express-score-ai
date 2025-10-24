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
      <div className={`${sizes[size]} relative`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Círculo base */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            className="fill-primary/10"
          />
          
          {/* Gráfico de crescimento estilizado */}
          <path 
            d="M 25 65 L 35 55 L 45 60 L 55 45 L 65 50 L 75 30" 
            className="stroke-primary" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Pontos de destaque */}
          <circle cx="25" cy="65" r="4" className="fill-primary" />
          <circle cx="35" cy="55" r="4" className="fill-primary" />
          <circle cx="45" cy="60" r="4" className="fill-primary" />
          <circle cx="55" cy="45" r="4" className="fill-primary" />
          <circle cx="65" cy="50" r="4" className="fill-primary" />
          <circle cx="75" cy="30" r="5" className="fill-primary animate-pulse" />
          
          {/* Seta indicando crescimento */}
          <path 
            d="M 70 35 L 75 30 L 75 38 Z" 
            className="fill-primary"
          />
        </svg>
      </div>
      
      {/* Nome da marca */}
      {showText && (
        <span className={`font-bold ${textSizes[size]} bg-gradient-primary bg-clip-text text-transparent`}>
          Pleno
        </span>
      )}
    </div>
  );
}
