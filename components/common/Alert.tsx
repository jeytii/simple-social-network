import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  type: 'success' | 'error';
  message?: string | null;
}

export default function Alert({
  className,
  type,
  message,
  children,
  ...props
}: Props) {
  return (
    <p
      className={clsx(
        'p-sm border rounded',
        type === 'success' &&
          'bg-success-transparent text-success border-success',
        type === 'error' && 'bg-danger-transparent text-danger border-danger',
        className
      )}
      {...props}
    >
      {message || children}
    </p>
  );
}
