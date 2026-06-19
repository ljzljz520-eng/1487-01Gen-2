import type { MaskFieldType, MaskRule } from '../types/patient';

const DEFAULT_MASK_RULES: Record<MaskFieldType, MaskRule> = {
  idCard: {
    field: 'idCard',
    visibleStart: 6,
    visibleEnd: 4,
    maskChar: '*'
  },
  phone: {
    field: 'phone',
    visibleStart: 3,
    visibleEnd: 4,
    maskChar: '*'
  },
  address: {
    field: 'address',
    keepPrefix: 6,
    maskChar: '*'
  },
  name: {
    field: 'name',
    visibleStart: 1,
    visibleEnd: 0,
    maskChar: '*'
  },
  allergen: {
    field: 'allergen',
    visibleStart: 0,
    visibleEnd: 0,
    maskChar: '*'
  }
};

export function maskIdCard(idCard: string, rule?: Partial<MaskRule>): string {
  if (!idCard) return '';
  const { visibleStart = 6, visibleEnd = 4, maskChar = '*' } = { ...DEFAULT_MASK_RULES.idCard, ...rule };
  
  if (idCard.length <= visibleStart + visibleEnd) {
    return idCard;
  }
  
  const start = idCard.slice(0, visibleStart);
  const end = idCard.slice(-visibleEnd);
  const maskLength = idCard.length - visibleStart - visibleEnd;
  
  return start + maskChar.repeat(maskLength) + end;
}

export function maskPhone(phone: string, rule?: Partial<MaskRule>): string {
  if (!phone) return '';
  const { visibleStart = 3, visibleEnd = 4, maskChar = '*' } = { ...DEFAULT_MASK_RULES.phone, ...rule };
  
  if (phone.length <= visibleStart + visibleEnd) {
    return phone;
  }
  
  const start = phone.slice(0, visibleStart);
  const end = phone.slice(-visibleEnd);
  const maskLength = phone.length - visibleStart - visibleEnd;
  
  return start + maskChar.repeat(maskLength) + end;
}

export function maskAddress(address: string, rule?: Partial<MaskRule>): string {
  if (!address) return '';
  const { keepPrefix = 6, maskChar = '*' } = { ...DEFAULT_MASK_RULES.address, ...rule };
  
  if (address.length <= keepPrefix) {
    return address;
  }
  
  return address.slice(0, keepPrefix) + maskChar.repeat(4);
}

export function maskName(name: string, rule?: Partial<MaskRule>): string {
  if (!name) return '';
  const { visibleStart = 1, maskChar = '*' } = { ...DEFAULT_MASK_RULES.name, ...rule };
  
  if (name.length <= visibleStart) {
    return name;
  }
  
  return name.slice(0, visibleStart) + maskChar.repeat(name.length - visibleStart);
}

export function maskAllergen(allergen: string, rule?: Partial<MaskRule>): string {
  if (!allergen) return '';
  const { maskChar = '*' } = { ...DEFAULT_MASK_RULES.allergen, ...rule };
  return maskChar.repeat(Math.min(allergen.length, 6));
}

export function maskValue(
  value: string,
  fieldType: MaskFieldType,
  customRule?: Partial<MaskRule>
): string {
  switch (fieldType) {
    case 'idCard':
      return maskIdCard(value, customRule);
    case 'phone':
      return maskPhone(value, customRule);
    case 'address':
      return maskAddress(value, customRule);
    case 'name':
      return maskName(value, customRule);
    case 'allergen':
      return maskAllergen(value, customRule);
    default:
      return value;
  }
}

export function maskObject<T extends Record<string, any>>(
  obj: T,
  fieldMappings: Partial<Record<keyof T, MaskFieldType>>,
  enabled: boolean = true
): T {
  if (!enabled) return obj;
  
  const result = { ...obj };
  
  for (const [field, fieldType] of Object.entries(fieldMappings)) {
    if (fieldType && typeof result[field as keyof T] === 'string') {
      result[field as keyof T] = maskValue(
        result[field as keyof T] as string,
        fieldType as MaskFieldType
      ) as T[keyof T];
    }
  }
  
  return result;
}

export function getMaskRule(fieldType: MaskFieldType): MaskRule {
  return DEFAULT_MASK_RULES[fieldType];
}

export function updateMaskRule(fieldType: MaskFieldType, rule: Partial<MaskRule>): void {
  DEFAULT_MASK_RULES[fieldType] = { ...DEFAULT_MASK_RULES[fieldType], ...rule };
}
