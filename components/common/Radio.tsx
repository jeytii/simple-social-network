import { memo, forwardRef } from 'react';
import clsx from 'clsx';
import {
  MdOutlineRadioButtonUnchecked,
  MdOutlineRadioButtonChecked,
} from 'react-icons/md';
import type { ForwardedRef, InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Radio(
  { className, label, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <label
      className={clsx(
        className,
        props.disabled && 'opacity-50 cursor-not-allowed'
      )}
      htmlFor={props.id}
    >
      {props.checked ? (
        <MdOutlineRadioButtonChecked
          className='text-primary-dark'
          size={15}
          viewBox='2 2 20 20'
        />
      ) : (
        <MdOutlineRadioButtonUnchecked
          className='text-skin-primary'
          size={15}
          viewBox='2 2 20 20'
        />
      )}

      <input ref={ref} className='hidden' type='radio' {...props} />
      <span className='text-skin-primary text-md ml-xs'>{label}</span>
    </label>
  );
}

export default memo(
  forwardRef(Radio),
  (prev, current) =>
    prev.checked === current.checked && prev.disabled === current.disabled
);
