import type { Gender, BloodType, MaritalStatus, FieldConfig, Validator, ValidationError, BaseFormComponentProps } from '@/types/form';
import type { PatientData } from '@/types/patient';

export interface PatientInfoProps extends BaseFormComponentProps {
  fields?: {
    name?: FieldConfig;
    gender?: FieldConfig;
    age?: FieldConfig;
    idCard?: FieldConfig;
    phone?: FieldConfig;
    address?: FieldConfig;
    bloodType?: FieldConfig;
    maritalStatus?: FieldConfig;
  };
  value?: Partial<PatientData>;
  onChange?: (data: Partial<PatientData>) => void;
  onFieldChange?: <K extends keyof PatientData>(field: K, value: PatientData[K]) => void;
  onValidate?: (errors: ValidationError[]) => void;
  showMaskToggle?: boolean;
}

export type { PatientData, Gender, BloodType, MaritalStatus, Validator, ValidationError };
