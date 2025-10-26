import fireceLogoDark from '@/assets/firece-logo.svg';
import fireceLogoWhite from '@/assets/firece-logo-white.svg';
import { useTheme } from '@/components/ThemeProvider';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'white' | 'dark';
}

export default function Logo({ size = 'md', className = '', variant }: LogoProps) {
  const { theme } = useTheme();
  
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  // Determinar qual logo usar baseado no tema e variant
  const logoSrc = (() => {
    // Se variant for especificado explicitamente, usar ele
    if (variant === 'white') return fireceLogoWhite;
    if (variant === 'dark') return fireceLogoDark;
    
    // Caso contrário, usar baseado no tema atual
    return theme === 'dark' ? fireceLogoWhite : fireceLogoDark;
  })();

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="Firece Logo" 
        className={`${sizes[size]} w-auto transition-all duration-300 hover:scale-105`}
      />
    </div>
  );
}
