import React, { FunctionComponent } from 'react';
import clsx from 'clsx';

type SkeletonProps = {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
};

export const Skeleton: FunctionComponent<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
};

// Pre-built skeleton loaders for common use cases
export const SkeletonLoader: FunctionComponent = () => (
  <div className="animate-pulse space-y-4">
    <Skeleton height={48} className="rounded-lg" />
    <Skeleton height={32} width="75%" className="rounded-lg" />
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} height={96} className="rounded-lg" />
      ))}
    </div>
  </div>
);



