import React, { useState, useEffect, useCallback } from 'react';
import { User, Calendar, Phone, MapPin, IdCard, Heart } from 'lucide-react';
import { FormField, Select, Card, CardHeader, CardTitle, CardBody } from '@/components/ui';
import { cn } from '@/lib/utils';
import { validateField, idCardValidator, phoneValidator, ageValidator, chineseNameValidator } from '@/utils/validators';
import { calculateAge, getGenderFromIdCard } from '@/utils/formatters';
import type { PatientInfoProps } from './PatientInfo.types';
import type { PatientData } from '@/types/patient';
import type { ValidationError, FieldConfig } from '@/types/form';

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '其他' }
];

const bloodTypeOptions = [
  { value: 'A', label: 'A型' },
  { value: 'B', label: 'B型' },
  { value: 'AB', label: 'AB型' },
  { value: 'O', label: 'O型' },
  { value: 'unknown', label: '未知' }
];

const maritalStatusOptions = [
  { value: 'single', label: '未婚' },
  { value: 'married', label: '已婚' },
  { value: 'divorced', label: '离异' },
  { value: 'widowed', label: '丧偶' },
  { value: 'unknown', label: '未知' }
];

const defaultFieldConfig: Record<string, FieldConfig> = {
  name: { required: true, label: '姓名' },
  gender: { required: true, label: '性别' },
  age: { required: true, label: '年龄' },
  idCard: { required: true, label: '身份证号' },
  phone: { required: true, label: '联系电话' },
  address: { required: false, label: '家庭住址' },
  bloodType: { required: false, label: '血型' },
  maritalStatus: { required: false, label: '婚姻状况' }
};

export const PatientInfo: React.FC<PatientInfoProps> = ({
  fields = {},
  value,
  onChange,
  onFieldChange,
  onValidate,
  required = false,
  readOnly = false,
  disabled = false,
  validators = [],
  maskSensitiveData = true,
  showMaskToggle = true,
  className
}) => {
  const mergedFields = { ...defaultFieldConfig, ...fields };
  
  const [formData, setFormData] = useState<Partial<PatientData>>(value || {});
  const [errors, setErrors] = useState<Record<string, ValidationError | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldMasked, setFieldMasked] = useState<Record<string, boolean>>({
    idCard: maskSensitiveData,
    phone: maskSensitiveData,
    address: maskSensitiveData,
    name: false
  });

  useEffect(() => {
    if (value) {
      setFormData(value);
    }
  }, [value]);

  const validateAndSetError = useCallback((field: string, value: any) => {
    const fieldConfig = mergedFields[field as keyof typeof mergedFields] as FieldConfig;
    if (!fieldConfig) return null;

    const fieldValidators = [];
    
    if (fieldConfig.required || required) {
      fieldValidators.push({
        rule: (v: any) => v !== '' && v !== null && v !== undefined,
        message: '此字段为必填项'
      });
    }

    if (field === 'idCard') fieldValidators.push(idCardValidator);
    if (field === 'phone') fieldValidators.push(phoneValidator);
    if (field === 'age') fieldValidators.push(ageValidator);
    if (field === 'name') fieldValidators.push(chineseNameValidator);
    
    if (fieldConfig.validators) {
      fieldValidators.push(...fieldConfig.validators);
    }

    const error = validateField(value, fieldValidators, field);
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  }, [mergedFields, required]);

  const handleChange = useCallback(<K extends keyof PatientData>(
    field: K, 
    newValue: PatientData[K]
  ) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: newValue };
      
      if (field === 'idCard' && typeof newValue === 'string') {
        const age = calculateAge(newValue);
        if (age !== null) {
          updated.age = age as PatientData['age'];
        }
        const gender = getGenderFromIdCard(newValue);
        if (gender) {
          updated.gender = gender;
        }
      }
      
      onChange?.(updated);
      onFieldChange?.(field, newValue);
      
      return updated;
    });

    if (touched[field]) {
      validateAndSetError(field, newValue);
    }
  }, [onChange, onFieldChange, touched, validateAndSetError]);

  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateAndSetError(field, formData[field as keyof PatientData]);
  }, [formData, validateAndSetError]);

  const handleMaskToggle = useCallback((field: string, isMasked: boolean) => {
    setFieldMasked(prev => ({ ...prev, [field]: isMasked }));
  }, []);

  const validateAll = useCallback((): ValidationError[] => {
    const allErrors: ValidationError[] = [];
    const newErrors: Record<string, ValidationError | null> = {};
    const newTouched: Record<string, boolean> = {};

    for (const [field, config] of Object.entries(mergedFields)) {
      if (config.hidden) continue;
      
      newTouched[field] = true;
      const error = validateAndSetError(field, formData[field as keyof PatientData]);
      if (error) {
        allErrors.push(error);
        newErrors[field] = error;
      } else {
        newErrors[field] = null;
      }
    }

    setErrors(newErrors);
    setTouched(newTouched);
    onValidate?.(allErrors);
    return allErrors;
  }, [mergedFields, formData, validateAndSetError, onValidate]);

  useEffect(() => {
    (window as any).validatePatientInfo = validateAll;
    return () => {
      delete (window as any).validatePatientInfo;
    };
  }, [validateAll]);

  const isFieldHidden = (field: string) => {
    return (mergedFields[field as keyof typeof mergedFields] as FieldConfig)?.hidden;
  };

  const isFieldRequired = (field: string) => {
    const config = mergedFields[field as keyof typeof mergedFields] as FieldConfig;
    return config?.required || required;
  };

  const isFieldReadOnly = (field: string) => {
    const config = mergedFields[field as keyof typeof mergedFields] as FieldConfig;
    return config?.readOnly || readOnly || disabled;
  };

  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-medical-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-medical-blue-600" />
          </div>
          <div>
            <CardTitle>患者基本信息</CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">请填写患者的基本信息</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {!isFieldHidden('name') && (
            <FormField
              label={mergedFields.name.label || '姓名'}
              name="name"
              required={isFieldRequired('name')}
              readOnly={isFieldReadOnly('name')}
              value={formData.name || ''}
              onChange={(v) => handleChange('name', v)}
              onBlur={() => handleBlur('name')}
              placeholder="请输入患者姓名"
              error={touched.name ? errors.name?.message : undefined}
              touched={touched.name}
              maskSensitive={fieldMasked.name}
              maskType="name"
              showMaskToggle={showMaskToggle && maskSensitiveData}
              onMaskToggle={(masked) => handleMaskToggle('name', masked)}
            />
          )}

          {!isFieldHidden('gender') && (
            <div className="space-y-1.5">
              <label className="form-label form-label-required">
                {mergedFields.gender.label || '性别'}
              </label>
              <Select
                name="gender"
                value={formData.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value as PatientData['gender'])}
                onBlur={() => handleBlur('gender')}
                options={genderOptions}
                placeholder="请选择性别"
                disabled={isFieldReadOnly('gender')}
                error={!!(touched.gender && errors.gender)}
              />
              {touched.gender && errors.gender && (
                <div className="form-error">{errors.gender.message}</div>
              )}
            </div>
          )}

          {!isFieldHidden('age') && (
            <div className="space-y-1.5">
              <label className="form-label" htmlFor="age">
                <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                {mergedFields.age.label || '年龄'}
                {isFieldRequired('age') && <span className="text-medical-red-500"> *</span>}
              </label>
              <div className="flex gap-2">
                <FormField
                  label=""
                  name="age"
                  type="number"
                  required={isFieldRequired('age')}
                  readOnly={isFieldReadOnly('age')}
                  value={formData.age || ''}
                  onChange={(v) => handleChange('age', parseInt(v) || 0)}
                  onBlur={() => handleBlur('age')}
                  placeholder="岁"
                  error={touched.age ? errors.age?.message : undefined}
                  touched={touched.age}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {!isFieldHidden('idCard') && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="form-label" htmlFor="idCard">
                  <IdCard className="w-3.5 h-3.5 inline mr-1.5" />
                  {mergedFields.idCard.label || '身份证号'}
                  {isFieldRequired('idCard') && <span className="text-medical-red-500"> *</span>}
                </label>
                {showMaskToggle && maskSensitiveData && (
                  <button
                    type="button"
                    onClick={() => handleMaskToggle('idCard', !fieldMasked.idCard)}
                    className="mask-toggle-btn"
                  >
                    {fieldMasked.idCard ? '显示完整' : '隐藏'}
                  </button>
                )}
              </div>
              <FormField
                label=""
                name="idCard"
                required={isFieldRequired('idCard')}
                readOnly={isFieldReadOnly('idCard')}
                value={formData.idCard || ''}
                onChange={(v) => handleChange('idCard', v)}
                onBlur={() => handleBlur('idCard')}
                placeholder="请输入18位身份证号"
                error={touched.idCard ? errors.idCard?.message : undefined}
                touched={touched.idCard}
                maskSensitive={fieldMasked.idCard}
                maskType="idCard"
                className="!mt-0"
              />
            </div>
          )}

          {!isFieldHidden('phone') && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="form-label" htmlFor="phone">
                  <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                  {mergedFields.phone.label || '联系电话'}
                  {isFieldRequired('phone') && <span className="text-medical-red-500"> *</span>}
                </label>
                {showMaskToggle && maskSensitiveData && (
                  <button
                    type="button"
                    onClick={() => handleMaskToggle('phone', !fieldMasked.phone)}
                    className="mask-toggle-btn"
                  >
                    {fieldMasked.phone ? '显示完整' : '隐藏'}
                  </button>
                )}
              </div>
              <FormField
                label=""
                name="phone"
                type="tel"
                required={isFieldRequired('phone')}
                readOnly={isFieldReadOnly('phone')}
                value={formData.phone || ''}
                onChange={(v) => handleChange('phone', v)}
                onBlur={() => handleBlur('phone')}
                placeholder="请输入11位手机号"
                error={touched.phone ? errors.phone?.message : undefined}
                touched={touched.phone}
                maskSensitive={fieldMasked.phone}
                maskType="phone"
                className="!mt-0"
              />
            </div>
          )}

          {!isFieldHidden('bloodType') && (
            <div className="space-y-1.5">
              <label className="form-label" htmlFor="bloodType">
                <Heart className="w-3.5 h-3.5 inline mr-1.5" />
                {mergedFields.bloodType.label || '血型'}
                {isFieldRequired('bloodType') && <span className="text-medical-red-500"> *</span>}
              </label>
              <Select
                name="bloodType"
                value={formData.bloodType || ''}
                onChange={(e) => handleChange('bloodType', e.target.value as PatientData['bloodType'])}
                onBlur={() => handleBlur('bloodType')}
                options={bloodTypeOptions}
                placeholder="请选择血型"
                disabled={isFieldReadOnly('bloodType')}
              />
            </div>
          )}

          {!isFieldHidden('maritalStatus') && (
            <div className="space-y-1.5">
              <label className="form-label" htmlFor="maritalStatus">
                {mergedFields.maritalStatus.label || '婚姻状况'}
                {isFieldRequired('maritalStatus') && <span className="text-medical-red-500"> *</span>}
              </label>
              <Select
                name="maritalStatus"
                value={formData.maritalStatus || ''}
                onChange={(e) => handleChange('maritalStatus', e.target.value as PatientData['maritalStatus'])}
                onBlur={() => handleBlur('maritalStatus')}
                options={maritalStatusOptions}
                placeholder="请选择婚姻状况"
                disabled={isFieldReadOnly('maritalStatus')}
              />
            </div>
          )}

          {!isFieldHidden('address') && (
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="form-label" htmlFor="address">
                  <MapPin className="w-3.5 h-3.5 inline mr-1.5" />
                  {mergedFields.address.label || '家庭住址'}
                  {isFieldRequired('address') && <span className="text-medical-red-500"> *</span>}
                </label>
                {showMaskToggle && maskSensitiveData && (
                  <button
                    type="button"
                    onClick={() => handleMaskToggle('address', !fieldMasked.address)}
                    className="mask-toggle-btn"
                  >
                    {fieldMasked.address ? '显示完整' : '隐藏'}
                  </button>
                )}
              </div>
              <FormField
                label=""
                name="address"
                required={isFieldRequired('address')}
                readOnly={isFieldReadOnly('address')}
                value={formData.address || ''}
                onChange={(v) => handleChange('address', v)}
                onBlur={() => handleBlur('address')}
                placeholder="请输入详细住址"
                error={touched.address ? errors.address?.message : undefined}
                touched={touched.address}
                maskSensitive={fieldMasked.address}
                maskType="address"
                className="!mt-0"
              />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default PatientInfo;
