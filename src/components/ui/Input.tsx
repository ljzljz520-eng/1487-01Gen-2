import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  maskSensitive?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, maskSensitive, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'form-input',
          error && 'form-input-error',
          maskSensitive && 'masked-text',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
