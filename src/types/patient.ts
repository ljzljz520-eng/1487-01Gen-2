import type { Gender, BloodType, MaritalStatus, AllergyType, SeverityLevel, ValidationError } from './form';

export interface PatientData {
  name: string;
  gender: Gender;
  age: number;
  idCard: string;
  phone: string;
  address: string;
  bloodType: BloodType;
  maritalStatus: MaritalStatus;
}

export interface AllergyRecord {
  id: string;
  type: AllergyType;
  allergen: string;
  severity: SeverityLevel;
  reaction: string;
  onsetDate: string;
  notes: string;
}

export interface TestItem {
  id: string;
  name: string;
  code: string;
  price: number;
  description?: string;
  categoryId: string;
}

export interface TestPackage {
  id: string;
  name: string;
  itemIds: string[];
  price: number;
  discountPrice?: number;
}

export interface TestCategory {
  id: string;
  name: string;
  description?: string;
  items: TestItem[];
  packages?: TestPackage[];
}

export interface FormSubmission {
  id: string;
  formType: string;
  patientData: PatientData;
  allergyData: AllergyRecord[];
  testItems: string[];
  signatureData: string;
  submittedBy: string;
  submittedAt: string;
}

export type MaskFieldType = 'idCard' | 'phone' | 'address' | 'name' | 'allergen';

export interface MaskRule {
  field: MaskFieldType;
  visibleStart?: number;
  visibleEnd?: number;
  maskChar?: string;
  keepPrefix?: number;
}
