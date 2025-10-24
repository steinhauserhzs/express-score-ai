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
          {/* Círculo base com gradiente */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'hsl(158, 64%, 42%)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'hsl(142, 76%, 36%)', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'hsl(158, 64%, 52%)', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: 'hsl(142, 76%, 46%)', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          
          {/* Glow externo */}
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="url(#glowGradient)"
            className="animate-pulse"
          />
          
          {/* Círculo base */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="url(#logoGradient)"
            opacity="0.15"
          />
          
          {/* Gráfico de crescimento estilizado - versão melhorada */}
          <path 
            d="M 20 70 L 30 58 L 40 62 L 50 45 L 60 48 L 70 30 L 80 25" 
            stroke="url(#logoGradient)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
            className="transition-all"
          />
          
          {/* Área preenchida sob o gráfico */}
          <path 
            d="M 20 70 L 30 58 L 40 62 L 50 45 L 60 48 L 70 30 L 80 25 L 80 80 L 20 80 Z" 
            fill="url(#logoGradient)"
            opacity="0.2"
          />
          
          {/* Pontos de destaque - maiores e com glow */}
          <circle cx="20" cy="70" r="3" fill="white" opacity="0.8" />
          <circle cx="30" cy="58" r="3" fill="white" opacity="0.8" />
          <circle cx="40" cy="62" r="3" fill="white" opacity="0.8" />
          <circle cx="50" cy="45" r="4" fill="white" opacity="0.9" />
          <circle cx="60" cy="48" r="4" fill="white" opacity="0.9" />
          <circle cx="70" cy="30" r="5" fill="white" className="animate-pulse" />
          <circle cx="80" cy="25" r="6" fill="white" className="animate-pulse" />
          
          {/* Seta indicando crescimento - melhorada */}
          <path 
            d="M 72 32 L 80 25 L 80 35 Z" 
            fill="white"
          />
          <path 
            d="M 80 25 L 88 25 L 80 17 Z" 
            fill="white"
          />
        </svg>
      </div>
      
      {/* Nome da marca */}
      {showText && (
        <span className={`font-bold ${textSizes[size]} bg-gradient-primary bg-clip-text text-transparent transition-all hover:opacity-90`}>
          Pleno
        </span>
      )}
    </div>
  );
}
