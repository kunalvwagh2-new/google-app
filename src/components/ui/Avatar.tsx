import React from 'react';
import { cn } from '../../lib/utils.ts';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  statusIndicator?: 'online' | 'offline';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name = 'User',
  size = 'md',
  className,
  statusIndicator,
}) => {
  const [hasError, setHasError] = React.useState(false);

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold ring-2 ring-white dark:ring-zinc-950 select-none',
          sizes[size]
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {statusIndicator && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-zinc-950',
            statusIndicator === 'online' ? 'bg-emerald-500' : 'bg-zinc-400'
          )}
        />
      )}
    </div>
  );
};
