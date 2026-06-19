import React from 'react';
import { cn } from '@/lib/utils';

interface FormLabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  required = false,
  children,
  className
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'form-label',
        required && 'form-label-required',
        className
      )}
    >
      {children}
    </label>
  );
};
