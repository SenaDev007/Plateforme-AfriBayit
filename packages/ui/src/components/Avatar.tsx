import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy/10 font-semibold text-navy select-none',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
        '2xl': 'h-24 w-24 text-2xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
  /** Show online indicator dot */
  online?: boolean;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({
  src,
  alt,
  fallback,
  size,
  className,
  online,
}: AvatarProps): React.ReactElement {
  const [imgError, setImgError] = React.useState(false);

  return (
    <span className="relative inline-flex">
      <span className={cn(avatarVariants({ size }), className)}>
        {src && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ''}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span aria-hidden="true">{getInitials(fallback ?? alt)}</span>
        )}
      </span>
      {online && (
        <span
          className="bg-emerald absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white"
          aria-label="En ligne"
        />
      )}
    </span>
  );
}

/** Avatar group — stacks up to 4 avatars with overflow count */
export function AvatarGroup({
  avatars,
  max = 4,
  size = 'sm',
  className,
}: {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}): React.ReactElement {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((a, i) => (
        <Avatar key={i} {...a} size={size} className="ring-2 ring-white" />
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            avatarVariants({ size }),
            'bg-charcoal-100 text-charcoal ring-2 ring-white',
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
