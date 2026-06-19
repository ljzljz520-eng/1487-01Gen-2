import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <div className="relative">
          <input
            ref={(el) => {
              if (el) {
                el.indeterminate = indeterminate || false;
              }
              if (typeof ref === 'function') {
                ref(el);
              } else if (ref) {
                ref.current = el;
              }
            }}
            type="checkbox"
            className={cn(
              'w-4 h-4 rounded border-slate-300 text-medical-blue-500',
              'focus:ring-medical-blue-500 focus:ring-offset-0',
              'cursor-pointer transition-colors',
              className
            )}
            {...props}
          />
        </div>
        {label && (
          <span className="text-sm text-slate-700">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
