import React from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormLabel } from './FormLabel';
import { Input } from './Input';
import type { MaskFieldType } from '@/types/patient';
import { maskValue } from '@/utils/privacyMask';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'tel' | 'email' | 'date';
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string | null;
  touched?: boolean;
  className?: string;
  maskSensitive?: boolean;
  maskType?: MaskFieldType;
  showMaskToggle?: boolean;
  onMaskToggle?: (isMasked: boolean) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  required = false,
  readOnly = false,
  disabled = false,
  value = '',
  onChange,
  onBlur,
  placeholder,
  error,
  touched = false,
  className,
  maskSensitive = false,
  maskType,
  showMaskToggle = false,
  onMaskToggle
}) => {
  const [isMasked, setIsMasked] = React.useState(maskSensitive);

  const displayValue = React.useMemo(() => {
    if (isMasked && maskType && typeof value === 'string') {
      return maskValue(value, maskType);
    }
    return value;
  }, [value, isMasked, maskType]);

  const handleMaskToggle = () => {
    const newMasked = !isMasked;
    setIsMasked(newMasked);
    onMaskToggle?.(newMasked);
  };

  const showError = touched && error;

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>
        {showMaskToggle && (
          <button
            type="button"
            onClick={handleMaskToggle}
            className="mask-toggle-btn inline-flex items-center gap-1"
          >
            {isMasked ? (
              <><Eye className="w-3 h-3" /> 显示完整</>
            ) : (
              <><EyeOff className="w-3 h-3" /> 隐藏</>
            )}
          </button>
        )}
      </div>
      <Input
        id={name}
        name={name}
        type={type}
        value={displayValue}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        error={!!showError}
        maskSensitive={isMasked}
      />
      {showError && (
        <div className="form-error">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
