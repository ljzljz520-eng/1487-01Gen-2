import type { BaseFormComponentProps, Validator, ValidationError, AllergyType, SeverityLevel } from '@/types/form';
import type { AllergyRecord } from '@/types/patient';

export interface AllergyHistoryProps extends BaseFormComponentProps {
  value?: AllergyRecord[];
  onChange?: (records: AllergyRecord[]) => void;
  onAllergyAdd?: (record: AllergyRecord) => void;
  onAllergyDelete?: (id: string) => void;
  onAllergyUpdate?: (record: AllergyRecord) => void;
  onValidate?: (errors: ValidationError[]) => void;
  maxRecords?: number;
  allowAdd?: boolean;
  allowDelete?: boolean;
  allowEdit?: boolean;
  maskSensitiveData?: boolean;
  showMaskToggle?: boolean;
}

export type { AllergyRecord, AllergyType, SeverityLevel, Validator, ValidationError };
