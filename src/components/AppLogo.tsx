import { useMemo, useState } from 'react';
import { BRAND } from '../config/brand';
import { cn } from '../utils/cn';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoTone = 'light' | 'dark' | 'amber';
type LogoAlign = 'left' | 'center';

interface AppLogoProps {
  size?: LogoSize;
  tone?: LogoTone;
  align?: LogoAlign;
  name?: string;
  subtitle?: string;
  logoSrc?: string | null;
  logoAlt?: string;
  className?: string;
}

const iconSizeMap: Record<LogoSize, string> = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-20 w-20 text-2xl',
};

const nameSizeMap: Record<LogoSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

const subtitleSizeMap: Record<LogoSize, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-sm',
};

const toneMap: Record<LogoTone, { name: string; subtitle: string }> = {
  light: {
    name: 'text-white',
    subtitle: 'text-slate-300',
  },
  dark: {
    name: 'text-slate-900',
    subtitle: 'text-slate-500',
  },
  amber: {
    name: 'text-amber-900',
    subtitle: 'text-amber-700',
  },
};

export default function AppLogo({
  size = 'md',
  tone = 'dark',
  align = 'left',
  name = BRAND.name,
  subtitle,
  logoSrc = BRAND.logoUrl,
  logoAlt = `Logo ${BRAND.name}`,
  className,
}: AppLogoProps) {
  const textTone = toneMap[tone];
  const isCentered = align === 'center';
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const showExternalLogo = Boolean(logoSrc) && !logoLoadFailed;
  const normalizedLogoSrc = useMemo(() => (logoSrc ? logoSrc.trim() : ''), [logoSrc]);

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        isCentered && 'flex-col justify-center text-center gap-2',
        className
      )}
    >
      {showExternalLogo ? (
        <img
          src={normalizedLogoSrc}
          alt={logoAlt}
          className={cn('rounded-2xl object-cover shadow-lg ring-1 ring-black/5', iconSizeMap[size])}
          onError={() => setLogoLoadFailed(true)}
          loading="eager"
        />
      ) : (
        <div
          className={cn(
            'relative inline-flex items-center justify-center rounded-2xl font-black tracking-wide text-white shadow-lg',
            'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500',
            iconSizeMap[size]
          )}
        >
          <span>{BRAND.markText}</span>
          <span className="absolute bottom-1 left-1.5 h-1.5 w-1.5 rounded-sm bg-black/25" />
          <span className="absolute bottom-1 right-1.5 h-1.5 w-1.5 rounded-sm bg-black/25" />
        </div>
      )}

      <div className={cn(isCentered && 'text-center')}>
        <h1 className={cn('font-bold leading-tight', nameSizeMap[size], textTone.name)}>{name}</h1>
        {subtitle && <p className={cn('mt-0.5 leading-tight', subtitleSizeMap[size], textTone.subtitle)}>{subtitle}</p>}
      </div>
    </div>
  );
}
