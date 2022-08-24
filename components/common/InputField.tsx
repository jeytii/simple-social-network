import { memo, forwardRef } from 'react';
import clsx from 'clsx';
import type { ForwardedRef, InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  label: string;
  error?: string;
}

function InputField(
  { containerClassName, className, label, error, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <section className={containerClassName}>
      <label className='text-skin-primary text-md font-bold' htmlFor={props.id}>
        {label}
      </label>

      <input
        ref={ref}
        className={clsx(
          'w-full bg-skin-main text-md text-skin-primary border p-sm rounded mt-xs disabled:opacity-50 disabled:cursor-not-allowed',
          className,
          error ? 'border-danger' : 'border-skin-main'
        )}
        {...props}
      />

      {!!error && <p className='text-danger text-sm mt-xs mb-0'>{error}</p>}
    </section>
  );
}

export default memo(
  forwardRef(InputField),
  (prev, current) =>
    prev.value === current.value &&
    prev.error === current.error &&
    prev.disabled === current.disabled
);
