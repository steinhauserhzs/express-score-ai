import flareLogo from '@/assets/flare-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'white' | 'dark';
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={flareLogo} 
        alt="Flare Logo" 
        className={`${sizes[size]} w-auto transition-all duration-300 hover:scale-105`}
      />
    </div>
  );
}
