import { create } from 'zustand';
import type { PatientData, AllergyRecord, TestItem, TestCategory } from '../types/patient';
import type { ValidationError } from '../types/form';

interface FormState {
  patientData: Partial<PatientData>;
  allergyRecords: AllergyRecord[];
  selectedTestItems: string[];
  signatureData: string;
  
  patientErrors: Record<string, ValidationError | null>;
  allergyErrors: Record<string, ValidationError | null>;
  testErrors: Record<string, ValidationError | null>;
  
  patientTouched: Record<string, boolean>;
  isSubmitting: boolean;
  
  setPatientData: (data: Partial<PatientData>) => void;
  setPatientField: <K extends keyof PatientData>(field: K, value: PatientData[K]) => void;
  
  addAllergyRecord: (record: Omit<AllergyRecord, 'id'>) => void;
  updateAllergyRecord: (id: string, record: Partial<AllergyRecord>) => void;
  removeAllergyRecord: (id: string) => void;
  
  toggleTestItem: (itemId: string) => void;
  setSelectedTestItems: (itemIds: string[]) => void;
  clearSelectedTestItems: () => void;
  
  setSignatureData: (data: string) => void;
  
  setPatientError: (field: string, error: ValidationError | null) => void;
  setPatientTouched: (field: string, touched: boolean) => void;
  
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  
  getSelectedTestItemsDetails: (categories: TestCategory[]) => TestItem[];
  getTotalPrice: (categories: TestCategory[]) => number;
  
  validatePatientData: () => ValidationError[];
  validateAllergyRecords: () => ValidationError[];
  validateTestItems: () => ValidationError[];
  validateAll: () => ValidationError[];
  
  isFormValid: () => boolean;
}

const initialPatientData: Partial<PatientData> = {
  name: '',
  gender: 'male',
  age: undefined as any,
  idCard: '',
  phone: '',
  address: '',
  bloodType: 'unknown',
  maritalStatus: 'unknown'
};

export const useFormStore = create<FormState>((set, get) => ({
  patientData: initialPatientData,
  allergyRecords: [],
  selectedTestItems: [],
  signatureData: '',
  
  patientErrors: {},
  allergyErrors: {},
  testErrors: {},
  
  patientTouched: {},
  isSubmitting: false,

  setPatientData: (data) => set({ patientData: { ...get().patientData, ...data } }),
  
  setPatientField: (field, value) => set((state) => ({
    patientData: { ...state.patientData, [field]: value }
  })),

  addAllergyRecord: (record) => set((state) => ({
    allergyRecords: [...state.allergyRecords, { ...record, id: Date.now().toString() }]
  })),
  
  updateAllergyRecord: (id, record) => set((state) => ({
    allergyRecords: state.allergyRecords.map(r => 
      r.id === id ? { ...r, ...record } : r
    )
  })),
  
  removeAllergyRecord: (id) => set((state) => ({
    allergyRecords: state.allergyRecords.filter(r => r.id !== id)
  })),

  toggleTestItem: (itemId) => set((state) => ({
    selectedTestItems: state.selectedTestItems.includes(itemId)
      ? state.selectedTestItems.filter(id => id !== itemId)
      : [...state.selectedTestItems, itemId]
  })),
  
  setSelectedTestItems: (itemIds) => set({ selectedTestItems: itemIds }),
  
  clearSelectedTestItems: () => set({ selectedTestItems: [] }),

  setSignatureData: (data) => set({ signatureData: data }),

  setPatientError: (field, error) => set((state) => ({
    patientErrors: { ...state.patientErrors, [field]: error }
  })),
  
  setPatientTouched: (field, touched) => set((state) => ({
    patientTouched: { ...state.patientTouched, [field]: touched }
  })),

  resetForm: () => set({
    patientData: initialPatientData,
    allergyRecords: [],
    selectedTestItems: [],
    signatureData: '',
    patientErrors: {},
    allergyErrors: {},
    testErrors: {},
    patientTouched: {},
    isSubmitting: false
  }),
  
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),

  getSelectedTestItemsDetails: (categories) => {
    const { selectedTestItems } = get();
    const items: TestItem[] = [];
    
    for (const category of categories) {
      for (const item of category.items) {
        if (selectedTestItems.includes(item.id)) {
          items.push(item);
        }
      }
    }
    
    return items;
  },
  
  getTotalPrice: (categories) => {
    const items = get().getSelectedTestItemsDetails(categories);
    return items.reduce((sum, item) => sum + item.price, 0);
  },

  validatePatientData: () => {
    const { patientData } = get();
    const errors: ValidationError[] = [];
    
    if (!patientData.name || patientData.name.trim() === '') {
      errors.push({ field: 'name', message: '姓名为必填项' });
    }
    
    if (patientData.idCard && !/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(patientData.idCard)) {
      errors.push({ field: 'idCard', message: '请输入有效的18位身份证号码' });
    }
    
    if (patientData.phone && !/^1[3-9]\d{9}$/.test(patientData.phone)) {
      errors.push({ field: 'phone', message: '请输入有效的11位手机号码' });
    }
    
    if (patientData.age !== undefined && (patientData.age < 0 || patientData.age > 150)) {
      errors.push({ field: 'age', message: '请输入0-150之间的有效年龄' });
    }
    
    const errorMap: Record<string, ValidationError | null> = {};
    for (const error of errors) {
      errorMap[error.field] = error;
    }
    
    set({ patientErrors: errorMap });
    return errors;
  },
  
  validateAllergyRecords: () => {
    const { allergyRecords } = get();
    const errors: ValidationError[] = [];
    
    allergyRecords.forEach((record, index) => {
      if (!record.allergen || record.allergen.trim() === '') {
        errors.push({ field: `allergen_${index}`, message: '过敏原为必填项' });
      }
    });
    
    return errors;
  },
  
  validateTestItems: () => {
    const { selectedTestItems } = get();
    const errors: ValidationError[] = [];
    
    if (selectedTestItems.length === 0) {
      errors.push({ field: 'testItems', message: '请至少选择一个检验项目' });
    }
    
    return errors;
  },
  
  validateAll: () => {
    const patientErrors = get().validatePatientData();
    const allergyErrors = get().validateAllergyRecords();
    const testErrors = get().validateTestItems();
    
    return [...patientErrors, ...allergyErrors, ...testErrors];
  },
  
  isFormValid: () => {
    const errors = get().validateAll();
    return errors.length === 0;
  }
}));
