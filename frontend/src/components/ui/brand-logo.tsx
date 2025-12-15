import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
  linkTo?: string;
}

const sizeConfig = {
  sm: {
    icon: 'w-6 h-6 text-[10px]',
    text: 'text-sm',
    iconRounded: 'rounded',
  },
  md: {
    icon: 'w-9 h-9 text-sm',
    text: 'text-xl',
    iconRounded: 'rounded-lg',
  },
  lg: {
    icon: 'w-10 h-10 text-lg',
    text: 'text-2xl',
    iconRounded: 'rounded-xl',
  },
};

const variantConfig = {
  light: {
    icon: 'bg-white text-slate-900 shadow-lg',
    text: 'text-white',
  },
  dark: {
    icon: 'bg-slate-900 text-white shadow-md',
    text: 'text-slate-900',
  },
};

export function BrandLogo({
  size = 'md',
  variant = 'dark',
  showText = true,
  className,
  linkTo = '/',
}: BrandLogoProps) {
  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center font-bold',
          sizeStyles.icon,
          sizeStyles.iconRounded,
          variantStyles.icon
        )}
      >
        E
      </div>
      {showText && (
        <span
          className={cn(
            'font-semibold tracking-tight heading-font',
            sizeStyles.text,
            variantStyles.text
          )}
        >
          ENGI CONNECT
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
