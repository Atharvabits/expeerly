'use client';
import React, {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  FunctionComponent,
  PropsWithChildren,
} from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// Base props shared between button and link
type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  fullWidth?: boolean;
  isOnlyIcon?: boolean;
  className?: string;
  loading?: boolean;
};

// Props for button element
type ButtonElementProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

// Props for link element
type LinkElementProps = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string;
  };

// Combined props type
type UnifiedButtonProps = ButtonElementProps | LinkElementProps;

const styleClasses = ({
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  isOnlyIcon = false,
}: BaseButtonProps) => {
  return clsx(
    // Base styles
    'flex items-center justify-center font-bold text-nowrap',
    'focus:outline-none',
    'rounded-full',
    // Variants
    {
      // Primary variant
      'bg-pink-500 text-white hover:bg-pink-600  active:bg-pink-700 border-2 border-pink-500 hover:border-pink-600':
        variant === 'primary',
      'disabled:bg-pink-300 disabled:hover:bg-pink-300 ': variant === 'primary',

      // Secondary variant
      'bg-navy-100 text-grey-700 hover:bg-grey-200 active:bg-grey-300 focus:ring-0 focus:bg-navy-100':
        variant === 'secondary',
      'disabled:bg-grey-100 disabled:hover:bg-grey-100 ': variant === 'secondary',

      // Outline variant
      'border-2 m-0 border-pink-500 text-pink-500 bg-transparent hover:border-pink-600 hover:text-pink-600':
        variant === 'outline',
      'focus:ring-pink-500': variant === 'outline',
      'disabled:border-pink-300 disabled:text-pink-300 disabled:hover:bg-transparent ':
        variant === 'outline',

      // Ghost variant
      'text-black bg-transparent hover:bg-grey-100 hover:text-grey-700 border-white border-2 hover:border-grey-100':
        variant === 'ghost',
      'active:bg-grey-100 focus:ring-0': variant === 'ghost',
      'disabled:text-grey-300 disabled:hover:bg-transparent ': variant === 'ghost',

      // Sizes with icon-only support
      'text-sm px-4  gap-1.5': size === 'sm' && !isOnlyIcon,
      'text-base px-6 py-3 gap-2 leading-3 max-h-11': size === 'md' && !isOnlyIcon,
      'text-base px-11 py-[13px] gap-2 max-h-[50px]': size === 'lg' && !isOnlyIcon,
      'p-2 h-10 w-10': size === 'sm' && isOnlyIcon,
      'p-3 h-12 w-12': size === 'md' && isOnlyIcon,
      'p-4 h-16 w-16': size === 'lg' && isOnlyIcon,

      // Width
      'w-full': fullWidth && !isOnlyIcon,
    },
    // Disabled state
    'disabled:cursor-not-allowed disabled:opacity-60',
    // Additional classes
    className
  );
};

const ButtonContent: FunctionComponent<
  Pick<BaseButtonProps, 'startContent' | 'endContent' | 'isOnlyIcon'> & PropsWithChildren
> = ({ startContent, endContent, isOnlyIcon, children }) => {
  if (isOnlyIcon) {
    return <>{children}</>;
  }

  return (
    <>
      {startContent && <span className="inline-flex shrink-0">{startContent}</span>}
      {children}
      {endContent && <span className="inline-flex shrink-0">{endContent}</span>}
    </>
  );
};

export const Button: FunctionComponent<PropsWithChildren<UnifiedButtonProps>> = ({
  variant = 'primary',
  size = 'md',
  startContent,
  endContent,
  fullWidth = false,
  isOnlyIcon = false,
  className = '',
  children,
  loading = false,
  ...rest
}) => {
  const classes = styleClasses({ variant, size, className, fullWidth, isOnlyIcon });
  const content = (
    <ButtonContent startContent={startContent} endContent={endContent} isOnlyIcon={isOnlyIcon}>
      {children}
    </ButtonContent>
  );

  if ('href' in rest) {
    const { href, ...linkProps } = rest as LinkElementProps;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {loading ? <Spinner size={size} /> : content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonElementProps)}
      disabled={loading || rest.disabled}
    >
      {loading ? <Spinner size={size} /> : content}
    </button>
  );
};



