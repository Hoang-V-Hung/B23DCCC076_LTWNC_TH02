import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'outline' | 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'outline', className = '', type = 'button', ...props }, ref,
) {
  return <button ref={ref} type={type}
    className={`button button--${variant} ${className}`.trim()} {...props} />;
});

Button.displayName = 'Button';
