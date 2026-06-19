import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, AlertTriangle, Pill, UtensilsCrossed, Activity, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, Button, FormField, Select } from '@/components/ui';
import { cn, generateId } from '@/lib/utils';
import { getSeverityLabel, getAllergyTypeLabel, formatDate } from '@/utils/formatters';
import { maskValue } from '@/utils/privacyMask';
import type { AllergyHistoryProps, AllergyRecord, AllergyType, SeverityLevel } from './AllergyHistory.types';

const allergyTypeOptions = [
  { value: 'drug', label: '药物过敏' },
  { value: 'food', label: '食物过敏' },
  { value: 'other', label: '其他过敏' }
];

const severityOptions = [
  { value: 'mild', label: '轻度' },
  { value: 'moderate', label: '中度' },
  { value: 'severe', label: '重度' }
];

const getTypeIcon = (type: AllergyType) => {
  switch (type) {
    case 'drug':
      return <Pill className="w-4 h-4" />;
    case 'food':
      return <UtensilsCrossed className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getSeverityBadgeClass = (severity: SeverityLevel) => {
  switch (severity) {
    case 'severe':
      return 'badge-severe';
    case 'moderate':
      return 'badge-moderate';
    case 'mild':
      return 'badge-mild';
    default:
      return '';
  }
};

const emptyRecord: Omit<AllergyRecord, 'id'> = {
  type: 'drug',
  allergen: '',
  severity: 'mild',
  reaction: '',
  onsetDate: '',
  notes: ''
};

export const AllergyHistory: React.FC<AllergyHistoryProps> = ({
  value = [],
  onChange,
  onAllergyAdd,
  onAllergyDelete,
  onAllergyUpdate,
  onValidate,
  required = false,
  readOnly = false,
  disabled = false,
  maxRecords = 10,
  allowAdd = true,
  allowDelete = true,
  allowEdit = true,
  maskSensitiveData = true,
  showMaskToggle = true,
  className
}) => {
  const [records, setRecords] = useState<AllergyRecord[]>(value);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<AllergyRecord, 'id'>>(emptyRecord);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMasked, setIsMasked] = useState(maskSensitiveData);

  useEffect(() => {
    setRecords(value);
  }, [value]);

  const validateRecord = useCallback((record: Omit<AllergyRecord, 'id'> | AllergyRecord): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    if (!record.allergen || record.allergen.trim() === '') {
      newErrors.allergen = '过敏原为必填项';
    }
    
    if (!record.reaction || record.reaction.trim() === '') {
      newErrors.reaction = '过敏反应为必填项';
    }
    
    return newErrors;
  }, []);

  const handleAdd = useCallback(() => {
    const validationErrors = validateRecord(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newRecord: AllergyRecord = {
      ...formData,
      id: generateId('allergy_')
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    onChange?.(updatedRecords);
    onAllergyAdd?.(newRecord);
    setFormData(emptyRecord);
    setShowAddForm(false);
    setErrors({});
  }, [formData, records, validateRecord, onChange, onAllergyAdd]);

  const handleUpdate = useCallback(() => {
    if (!editingId) return;

    const validationErrors = validateRecord(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedRecords = records.map(r =>
      r.id === editingId ? { ...r, ...formData } : r
    );
    
    setRecords(updatedRecords);
    onChange?.(updatedRecords);
    onAllergyUpdate?.({ ...formData, id: editingId });
    setEditingId(null);
    setFormData(emptyRecord);
    setErrors({});
  }, [editingId, formData, records, validateRecord, onChange, onAllergyUpdate]);

  const handleDelete = useCallback((id: string) => {
    const updatedRecords = records.filter(r => r.id !== id);
    setRecords(updatedRecords);
    onChange?.(updatedRecords);
    onAllergyDelete?.(id);
  }, [records, onChange, onAllergyDelete]);

  const handleEdit = useCallback((record: AllergyRecord) => {
    setEditingId(record.id);
    setFormData(record);
    setExpandedId(record.id);
    setErrors({});
  }, []);

  const handleCancel = useCallback(() => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData(emptyRecord);
    setErrors({});
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const displayAllergen = useCallback((allergen: string) => {
    if (isMasked) {
      return maskValue(allergen, 'allergen');
    }
    return allergen;
  }, [isMasked]);

  const canAdd = allowAdd && !readOnly && !disabled && records.length < maxRecords && !showAddForm && !editingId;

  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-medical-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-medical-orange-600" />
            </div>
            <div>
              <CardTitle>过敏史</CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">
                {records.length > 0 ? `共 ${records.length} 条过敏记录` : '暂无过敏记录'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showMaskToggle && maskSensitiveData && (
              <button
                type="button"
                onClick={() => setIsMasked(!isMasked)}
                className="mask-toggle-btn inline-flex items-center gap-1"
              >
                {isMasked ? (
                  <><Eye className="w-4 h-4" /> 显示</>
                ) : (
                  <><EyeOff className="w-4 h-4" /> 隐藏</>
                )}
              </button>
            )}
            {canAdd && (
              <Button
                size="sm"
                onClick={() => {
                  setShowAddForm(true);
                  setFormData(emptyRecord);
                  setErrors({});
                }}
              >
                <Plus className="w-4 h-4" />
                添加记录
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {required && records.length === 0 && !showAddForm && (
          <div className="text-sm text-medical-red-500 bg-medical-red-50 px-4 py-2 rounded-lg">
            请至少添加一条过敏史记录
          </div>
        )}

        {showAddForm && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 animate-slide-up">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">新增过敏记录</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="form-label form-label-required">过敏类型</label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AllergyType }))}
                  options={allergyTypeOptions}
                  placeholder="请选择过敏类型"
                  disabled={readOnly || disabled}
                />
              </div>
              <div className="space-y-1.5">
                <label className="form-label form-label-required">严重程度</label>
                <Select
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as SeverityLevel }))}
                  options={severityOptions}
                  placeholder="请选择严重程度"
                  disabled={readOnly || disabled}
                />
              </div>
              <FormField
                label="过敏原"
                name="allergen"
                required
                readOnly={readOnly || disabled}
                value={formData.allergen}
                onChange={(v) => setFormData(prev => ({ ...prev, allergen: v }))}
                placeholder="如：青霉素、花生等"
                error={errors.allergen}
                touched={!!errors.allergen}
                maskSensitive={isMasked}
                maskType="allergen"
                showMaskToggle={showMaskToggle && maskSensitiveData}
              />
              <FormField
                label="发作日期"
                name="onsetDate"
                type="date"
                readOnly={readOnly || disabled}
                value={formData.onsetDate}
                onChange={(v) => setFormData(prev => ({ ...prev, onsetDate: v }))}
                placeholder="请选择发作日期"
              />
              <div className="md:col-span-2">
                <FormField
                  label="过敏反应"
                  name="reaction"
                  required
                  readOnly={readOnly || disabled}
                  value={formData.reaction}
                  onChange={(v) => setFormData(prev => ({ ...prev, reaction: v }))}
                  placeholder="请描述过敏反应症状"
                  error={errors.reaction}
                  touched={!!errors.reaction}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  label="备注"
                  name="notes"
                  readOnly={readOnly || disabled}
                  value={formData.notes}
                  onChange={(v) => setFormData(prev => ({ ...prev, notes: v }))}
                  placeholder="其他需要说明的信息"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                取消
              </Button>
              <Button size="sm" onClick={handleAdd}>
                确认添加
              </Button>
            </div>
          </div>
        )}

        {records.map((record, index) => (
          <div
            key={record.id}
            className={cn(
              'border rounded-xl overflow-hidden transition-all duration-200',
              expandedId === record.id ? 'border-medical-blue-300 bg-medical-blue-50/30' : 'border-slate-200 hover:border-slate-300',
              editingId === record.id && 'ring-2 ring-medical-blue-500/30'
            )}
          >
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 transition-colors"
              onClick={() => toggleExpand(record.id)}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">
                    {getTypeIcon(record.type)}
                  </span>
                  <span className="font-medium text-slate-700">
                    {getAllergyTypeLabel(record.type)}
                  </span>
                  <span className="text-slate-400">：</span>
                  <span className={cn('font-medium', isMasked && 'masked-text')}>
                    {displayAllergen(record.allergen)}
                  </span>
                </div>
                <span className={cn('badge', getSeverityBadgeClass(record.severity))}>
                  {getSeverityLabel(record.severity)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {allowEdit && !readOnly && !disabled && !editingId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(record);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                {allowDelete && !readOnly && !disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(record.id);
                    }}
                    className="text-medical-red-500 hover:text-medical-red-600 hover:bg-medical-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                {expandedId === record.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {expandedId === record.id && (
              <div className="px-4 pb-4">
                {editingId === record.id ? (
                  <div className="bg-white rounded-lg p-4 border border-slate-200 mt-2">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">编辑过敏记录</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="form-label form-label-required">过敏类型</label>
                        <Select
                          value={formData.type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AllergyType }))}
                          options={allergyTypeOptions}
                          placeholder="请选择过敏类型"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="form-label form-label-required">严重程度</label>
                        <Select
                          value={formData.severity}
                          onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as SeverityLevel }))}
                          options={severityOptions}
                          placeholder="请选择严重程度"
                        />
                      </div>
                      <FormField
                        label="过敏原"
                        name="edit_allergen"
                        required
                        value={formData.allergen}
                        onChange={(v) => setFormData(prev => ({ ...prev, allergen: v }))}
                        placeholder="如：青霉素、花生等"
                        error={errors.allergen}
                        touched={!!errors.allergen}
                      />
                      <FormField
                        label="发作日期"
                        name="edit_onsetDate"
                        type="date"
                        value={formData.onsetDate}
                        onChange={(v) => setFormData(prev => ({ ...prev, onsetDate: v }))}
                      />
                      <div className="md:col-span-2">
                        <FormField
                          label="过敏反应"
                          name="edit_reaction"
                          required
                          value={formData.reaction}
                          onChange={(v) => setFormData(prev => ({ ...prev, reaction: v }))}
                          placeholder="请描述过敏反应症状"
                          error={errors.reaction}
                          touched={!!errors.reaction}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          label="备注"
                          name="edit_notes"
                          value={formData.notes}
                          onChange={(v) => setFormData(prev => ({ ...prev, notes: v }))}
                          placeholder="其他需要说明的信息"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="secondary" size="sm" onClick={handleCancel}>
                        取消
                      </Button>
                      <Button size="sm" onClick={handleUpdate}>
                        保存修改
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">过敏反应：</span>
                      <span className="text-slate-700">{record.reaction}</span>
                    </div>
                    {record.onsetDate && (
                      <div>
                        <span className="text-slate-500">发作日期：</span>
                        <span className="text-slate-700">{formatDate(record.onsetDate)}</span>
                      </div>
                    )}
                    {record.notes && (
                      <div className="md:col-span-2">
                        <span className="text-slate-500">备注：</span>
                        <span className="text-slate-700">{record.notes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {records.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>暂无过敏史记录</p>
            {canAdd && (
              <Button size="sm" className="mt-4" onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4" />
                添加第一条记录
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AllergyHistory;
