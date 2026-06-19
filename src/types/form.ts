export interface Validator {
  rule: RegExp | ((value: any) => boolean);
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FieldConfig {
  required?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  validators?: Validator[];
  label?: string;
  placeholder?: string;
}

export interface BaseFormComponentProps {
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  validators?: Validator[];
  onValidate?: (errors: ValidationError[]) => void;
  onChange?: (value: any) => void;
  value?: any;
  maskSensitiveData?: boolean;
  className?: string;
}

export type SeverityLevel = 'mild' | 'moderate' | 'severe';
export type AllergyType = 'drug' | 'food' | 'other';
export type Gender = 'male' | 'female' | 'other';
export type BloodType = 'A' | 'B' | 'AB' | 'O' | 'unknown';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'unknown';

export interface FieldConfig {
  required?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  validators?: Validator[];
  label?: string;
  placeholder?: string;
}
