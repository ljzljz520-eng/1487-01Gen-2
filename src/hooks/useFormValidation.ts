import { useState, useCallback, useEffect } from 'react';
import type { Validator, ValidationError } from '../types/form';
import { validateField } from '../utils/validators';

interface UseFormValidationOptions {
  validators?: Validator[];
  required?: boolean;
  fieldName: string;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormValidationReturn {
  value: any;
  setValue: (value: any) => void;
  error: ValidationError | null;
  touched: boolean;
  setTouched: (touched: boolean) => void;
  validate: () => ValidationError | null;
  reset: () => void;
  isValid: boolean;
}

export function useFormValidation(
  options: UseFormValidationOptions
): UseFormValidationReturn {
  const {
    validators = [],
    required = false,
    fieldName,
    validateOnChange = true,
    validateOnBlur = true
  } = options;

  const [value, setValueState] = useState<any>('');
  const [error, setError] = useState<ValidationError | null>(null);
  const [touched, setTouched] = useState(false);

  const allValidators = required
    ? [{ rule: (v: any) => v !== '' && v !== null && v !== undefined, message: '此字段为必填项' }, ...validators]
    : validators;

  const validate = useCallback((): ValidationError | null => {
    const validationError = validateField(value, allValidators, fieldName);
    setError(validationError);
    return validationError;
  }, [value, allValidators, fieldName]);

  const setValue = useCallback((newValue: any) => {
    setValueState(newValue);
    if (validateOnChange && touched) {
      const validationError = validateField(newValue, allValidators, fieldName);
      setError(validationError);
    }
  }, [validateOnChange, touched, allValidators, fieldName]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validateOnBlur) {
      validate();
    }
  }, [validateOnBlur, validate]);

  const reset = useCallback(() => {
    setValueState('');
    setError(null);
    setTouched(false);
  }, []);

  useEffect(() => {
    if (touched) {
      validate();
    }
  }, [touched, validate]);

  const isValid = !error && value !== '' && value !== null && value !== undefined;

  return {
    value,
    setValue,
    error,
    touched,
    setTouched: handleBlur,
    validate,
    reset,
    isValid
  };
}

interface UseFormGroupOptions {
  fields: Record<string, Omit<UseFormValidationOptions, 'fieldName'>>;
}

interface UseFormGroupReturn {
  values: Record<string, any>;
  errors: Record<string, ValidationError | null>;
  touched: Record<string, boolean>;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string) => void;
  validateField: (field: string) => ValidationError | null;
  validateAll: () => ValidationError[];
  reset: () => void;
  isValid: boolean;
  getFieldProps: (field: string) => any;
}

export function useFormGroup(options: UseFormGroupOptions): UseFormGroupReturn {
  const { fields } = options;
  
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, ValidationError | null>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});

  const fieldValidators: Record<string, Validator[]> = {};
  
  for (const [fieldName, fieldOptions] of Object.entries(fields)) {
    const { validators = [], required = false } = fieldOptions;
    fieldValidators[fieldName] = required
      ? [{ rule: (v: any) => v !== '' && v !== null && v !== undefined, message: '此字段为必填项' }, ...validators]
      : validators;
  }

  const validateFieldInternal = useCallback((field: string): ValidationError | null => {
    const value = values[field];
    const validators = fieldValidators[field] || [];
    const error = validateField(value, validators, field);
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  }, [values, fieldValidators]);

  const validateAll = useCallback((): ValidationError[] => {
    const allErrors: ValidationError[] = [];
    const newErrors: Record<string, ValidationError | null> = {};
    const newTouched: Record<string, boolean> = {};

    for (const field of Object.keys(fields)) {
      const value = values[field];
      const validators = fieldValidators[field] || [];
      const error = validateField(value, validators, field);
      
      newTouched[field] = true;
      if (error) {
        allErrors.push(error);
        newErrors[field] = error;
      } else {
        newErrors[field] = null;
      }
    }

    setErrors(newErrors);
    setTouchedState(newTouched);
    return allErrors;
  }, [fields, values, fieldValidators]);

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const validators = fieldValidators[field] || [];
      const error = validateField(value, validators, field);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [touched, fieldValidators]);

  const setFieldTouched = useCallback((field: string) => {
    setTouchedState(prev => ({ ...prev, [field]: true }));
    const validators = fieldValidators[field] || [];
    const value = values[field];
    const error = validateField(value, validators, field);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [values, fieldValidators]);

  const reset = useCallback(() => {
    setValues({});
    setErrors({});
    setTouchedState({});
  }, []);

  const isValid = Object.values(errors).every(e => e === null) && 
    Object.keys(fields).every(f => values[f] !== '' && values[f] !== null && values[f] !== undefined);

  const getFieldProps = useCallback((field: string) => ({
    value: values[field] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFieldValue(field, e.target.value);
    },
    onBlur: () => setFieldTouched(field),
    error: errors[field],
    touched: touched[field]
  }), [values, errors, touched, setFieldValue, setFieldTouched]);

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateField: validateFieldInternal,
    validateAll,
    reset,
    isValid,
    getFieldProps
  };
}
