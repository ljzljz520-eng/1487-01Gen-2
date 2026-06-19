import type { Validator, ValidationError } from '../types/form';

export const requiredValidator: Validator = {
  rule: (value: any) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },
  message: '此字段为必填项'
};

export const idCardValidator: Validator = {
  rule: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
  message: '请输入有效的18位身份证号码'
};

export const phoneValidator: Validator = {
  rule: /^1[3-9]\d{9}$/,
  message: '请输入有效的11位手机号码'
};

export const emailValidator: Validator = {
  rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: '请输入有效的邮箱地址'
};

export const ageValidator: Validator = {
  rule: (value: any) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && num <= 150 && Number.isInteger(num);
  },
  message: '请输入0-150之间的有效年龄'
};

export const chineseNameValidator: Validator = {
  rule: /^[\u4e00-\u9fa5]{2,20}$/,
  message: '请输入2-20个中文字符的姓名'
};

export function validateField(
  value: any,
  validators: Validator[],
  fieldName: string
): ValidationError | null {
  for (const validator of validators) {
    const isValid = typeof validator.rule === 'function'
      ? validator.rule(value)
      : validator.rule.test(String(value));
    
    if (!isValid) {
      return {
        field: fieldName,
        message: validator.message
      };
    }
  }
  return null;
}

export function validateForm<T extends Record<string, any>>(
  values: T,
  fieldValidators: Record<keyof T, Validator[]>
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const [field, validators] of Object.entries(fieldValidators)) {
    const error = validateField(values[field as keyof T], validators, field);
    if (error) {
      errors.push(error);
    }
  }
  
  return errors;
}

export function createRequiredValidator(message?: string): Validator {
  return {
    ...requiredValidator,
    message: message || requiredValidator.message
  };
}

export function createPatternValidator(pattern: RegExp, message: string): Validator {
  return {
    rule: pattern,
    message
  };
}

export function createCustomValidator(
  validateFn: (value: any) => boolean,
  message: string
): Validator {
  return {
    rule: validateFn,
    message
  };
}
