interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'white' | 'dark';
}

export default function Logo({ size = 'md', showText = true, className = '', variant = 'default' }: LogoProps) {
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

  const colors = {
    default: {
      flame: 'hsl(14, 100%, 50%)',
      text: 'text-secondary'
    },
    white: {
      flame: 'hsl(0, 0%, 100%)',
      text: 'text-white'
    },
    dark: {
      flame: 'hsl(0, 0%, 24%)',
      text: 'text-secondary'
    }
  };

  const currentColors = colors[variant];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Firece - Símbolo de Chama Estilizado */}
      <div className={`${sizes[size]} relative group`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
          {/* Chama principal - formato estilizado */}
          <path
            d="M 50 10 
               C 50 10, 65 25, 65 40
               C 65 50, 60 55, 55 60
               C 55 60, 60 55, 62 48
               C 64 40, 60 35, 55 32
               C 55 32, 58 38, 58 45
               C 58 52, 52 58, 50 60
               C 48 58, 42 52, 42 45
               C 42 38, 45 32, 45 32
               C 40 35, 36 40, 38 48
               C 40 55, 45 60, 45 60
               C 40 55, 35 50, 35 40
               C 35 25, 50 10, 50 10 Z"
            fill={currentColors.flame}
            className="drop-shadow-md"
          />
          
          {/* Base da chama - efeito de intensidade */}
          <ellipse
            cx="50"
            cy="62"
            rx="18"
            ry="8"
            fill={currentColors.flame}
            opacity="0.3"
          />
          
          {/* Detalhe interno - ponto quente */}
          <path
            d="M 50 25
               C 50 25, 55 32, 55 40
               C 55 45, 52 48, 50 50
               C 48 48, 45 45, 45 40
               C 45 32, 50 25, 50 25 Z"
            fill="white"
            opacity="0.6"
          />
          
          {/* Faísca 1 - canto superior direito */}
          <circle
            cx="70"
            cy="20"
            r="2.5"
            fill={currentColors.flame}
            className="animate-fire-flicker"
          />
          
          {/* Faísca 2 - canto superior esquerdo */}
          <circle
            cx="30"
            cy="25"
            r="2"
            fill={currentColors.flame}
            className="animate-fire-flicker"
            style={{ animationDelay: '0.3s' }}
          />
          
          {/* Faísca 3 - lateral */}
          <circle
            cx="25"
            cy="45"
            r="1.5"
            fill={currentColors.flame}
            className="animate-fire-flicker"
            style={{ animationDelay: '0.6s' }}
          />
        </svg>
      </div>
      
      {/* Nome da marca - Firece com separador vertical */}
      {showText && (
        <div className={`font-bold ${textSizes[size]} ${currentColors.text} flex items-center gap-1 transition-all hover:opacity-90`}>
          <span className="tracking-tight">Fire</span>
          <span className="text-primary font-black">|</span>
          <span className="tracking-tight">ce</span>
        </div>
      )}
    </div>
  );
}
