'use client';
import React, { FunctionComponent, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarFallback = 'user' | 'initials';

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
};

export const Avatar: FunctionComponent<AvatarProps> = ({
  src = null,
  alt = 'User avatar',
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses: Record<AvatarSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const fallbackOptions: Record<AvatarFallback, React.ReactNode> = {
    user: (
      <svg className="w-full h-full p-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
    initials: <span className="text-grey-700 font-medium">{getInitials(alt)}</span>,
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-center bg-grey-100 border border-grey-300 overflow-hidden rounded-full p-0.5',
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={alt}
    >
      {src && !imageError ? (
        <Image
          src={src?.startsWith('//') ? `https:${src}` : src}
          alt={alt}
          className="w-full h-full object-contain rounded-full flex"
          height={20}
          width={20}
          sizes="100% 100%"
          onError={handleImageError}
        />
      ) : (
        fallbackOptions['initials']
      )}
    </div>
  );
};



