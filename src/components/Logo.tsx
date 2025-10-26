import fireceLogo from '@/assets/firece-logo.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'white' | 'dark';
}

export default function Logo({ size = 'md', showText = false, className = '', variant = 'default' }: LogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  // O logo oficial já inclui o texto, então sempre mostramos o logo completo
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={fireceLogo} 
        alt="Firece Logo" 
        className={`${sizes[size]} w-auto transition-transform hover:scale-105`}
        style={{
          filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none'
        }}
      />
    </div>
  );
}
