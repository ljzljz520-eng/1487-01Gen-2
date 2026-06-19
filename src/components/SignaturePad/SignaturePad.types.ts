import type { BaseFormComponentProps, Validator, ValidationError } from '@/types/form';

export interface SignaturePadProps extends BaseFormComponentProps {
  width?: number;
  height?: number;
  penColor?: string;
  penWidth?: number;
  backgroundColor?: string;
  showClearButton?: boolean;
  showUndoButton?: boolean;
  showConfirmButton?: boolean;
  exportFormat?: 'png' | 'jpeg' | 'svg';
  onSign?: (signatureData: string) => void;
  onSignStart?: () => void;
  onSignEnd?: (signatureData: string) => void;
  onSignClear?: () => void;
  onConfirm?: (signatureData: string) => void;
  value?: string;
  onChange?: (signatureData: string) => void;
  onValidate?: (errors: ValidationError[]) => void;
}

export type { Validator, ValidationError };
