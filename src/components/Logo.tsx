import { useTheme } from './ThemeProvider';
import flareLogoLight from '@/assets/flare-logo.png';
import flareLogoDark from '@/assets/flare-logo-dark.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const { theme } = useTheme();
  
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  const currentLogo = theme === 'dark' ? flareLogoDark : flareLogoLight;

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={currentLogo} 
        alt="Flare Logo" 
        className={`${sizes[size]} w-auto transition-all duration-300 hover:scale-105`}
        key={theme}
      />
    </div>
  );
}
