import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientInfo } from '@/components/PatientInfo';
import { TestItemSelector } from '@/components/TestItemSelector';
import { SignaturePad } from '@/components/SignaturePad';
import { Button } from '@/components/ui';
import { mockTestCategories, mockPatientData, mockSelectedTestItems } from '@/data/mockData';
import type { PatientData, TestItem } from '@/types/patient';
import { AlertCircle, CheckCircle, FlaskConical, ArrowLeft, Save, Printer, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function LaboratoryForm() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<Partial<PatientData>>(mockPatientData);
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>(mockSelectedTestItems);
  const [selectedTestItems, setSelectedTestItems] = useState<TestItem[]>([]);
  const [signatureData, setSignatureData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [urgent, setUrgent] = useState(false);
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('');

  const selectedItems = mockTestCategories.flatMap(cat => 
    cat.items.filter(item => selectedTestIds.includes(item.id))
  );

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const validateForm = (): boolean => {
    const allErrors: string[] = [];

    if (typeof (window as any).validatePatientInfo === 'function') {
      const patientErrors = (window as any).validatePatientInfo();
      if (patientErrors.length > 0) {
        allErrors.push(...patientErrors.map((e: any) => e.message));
      }
    }

    if (typeof (window as any).validateTestItems === 'function') {
      const testErrors = (window as any).validateTestItems();
      if (testErrors.length > 0) {
        allErrors.push(...testErrors.map((e: any) => e.message));
      }
    }

    if (!clinicalDiagnosis.trim()) {
      allErrors.push('请填写临床诊断');
    }

    if (typeof (window as any).validateSignature === 'function') {
      const sigErrors = (window as any).validateSignature();
      if (sigErrors.length > 0) {
        allErrors.push(...sigErrors.map((e: any) => e.message));
      }
    }

    setErrors(allErrors);
    return allErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const formData = {
      patientData,
      testItems: selectedItems,
      totalPrice,
      urgent,
      clinicalDiagnosis,
      signatureData,
      formType: 'laboratory-request',
      requestNo: 'LAB' + Date.now(),
      requestDate: new Date().toISOString(),
      submittedAt: new Date().toISOString()
    };

    console.log('提交的检验申请单:', formData);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-5xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-medical-purple-100 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-medical-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">检验申请单</h1>
                <p className="text-slate-500">Laboratory Test Request Form</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                <Clock className={cn('w-4 h-4', urgent ? 'text-medical-red-500' : 'text-slate-400')} />
                <span className={cn('text-sm font-medium', urgent ? 'text-medical-red-600' : 'text-slate-600')}>
                  加急
                </span>
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                  className="w-4 h-4 text-medical-red-500 rounded border-slate-300 focus:ring-medical-red-500"
                />
              </label>
              <Button variant="secondary" onClick={handlePrint}>
                <Printer className="w-4 h-4" />
                打印
              </Button>
            </div>
          </div>
        </div>

        <div className="card p-4 mb-6 flex items-center justify-between bg-slate-50">
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div>
              <span className="text-slate-500">申请单号：</span>
              <span className="font-mono text-slate-700">LAB{Date.now()}</span>
            </div>
            <div>
              <span className="text-slate-500">申请日期：</span>
              <span className="text-slate-700">{formatDate(new Date(), 'YYYY-MM-DD')}</span>
            </div>
            <div>
              <span className="text-slate-500">申请科室：</span>
              <span className="text-slate-700">检验科</span>
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-medical-red-50 border border-medical-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-medical-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-medical-red-800 mb-2">请修正以下问题</h4>
                <ul className="text-sm text-medical-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="mb-6 p-4 bg-medical-green-50 border border-medical-green-200 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-medical-green-500" />
              <span className="font-medium text-medical-green-800">
                检验申请单已提交！标本条码已生成，请及时采样。
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <PatientInfo
            value={patientData}
            onChange={setPatientData}
            fields={{
              name: { required: true },
              gender: { required: true },
              age: { required: true },
              idCard: { required: false },
              phone: { required: true },
              address: { required: false, hidden: true },
              bloodType: { required: false },
              maritalStatus: { required: false, hidden: true }
            }}
            maskSensitiveData={true}
            showMaskToggle={true}
          />

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-slate-800">临床诊断</h3>
            </div>
            <div className="card-body">
              <textarea
                value={clinicalDiagnosis}
                onChange={(e) => setClinicalDiagnosis(e.target.value)}
                placeholder="请填写患者的临床诊断或症状描述，为检验结果解读提供参考..."
                className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-medical-blue-500 focus:shadow-input-focus"
              />
            </div>
          </div>

          <TestItemSelector
            categories={mockTestCategories}
            value={selectedTestIds}
            onChange={(ids, items) => {
              setSelectedTestIds(ids);
              setSelectedTestItems(items);
            }}
            required={true}
            maxSelect={20}
            showPrice={true}
            allowPackage={true}
            showSelectedSummary={true}
            searchable={true}
          />

          {selectedItems.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-slate-800">检验项目明细</h3>
              </div>
              <div className="card-body p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">项目编码</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">项目名称</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">检验类别</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">价格</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedItems.map((item, index) => {
                        const category = mockTestCategories.find(c => c.id === item.categoryId);
                        return (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-mono text-sm text-slate-600">{item.code}</td>
                            <td className="py-3 px-4 text-sm text-slate-800">{item.name}</td>
                            <td className="py-3 px-4 text-sm text-slate-500">{category?.name}</td>
                            <td className="py-3 px-4 text-sm text-slate-700 text-right font-medium">{formatCurrency(item.price)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                      <tr>
                        <td colSpan={3} className="py-4 px-4 text-right font-semibold text-slate-700">
                          合计（{selectedItems.length} 项）
                        </td>
                        <td className="py-4 px-4 text-right text-lg font-bold text-medical-orange-600">
                          {formatCurrency(totalPrice)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          <SignaturePad
            value={signatureData}
            onChange={setSignatureData}
            required={true}
            width={700}
            height={180}
            penColor="#1a1a1a"
            penWidth={2}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <Button variant="secondary" onClick={() => navigate('/')}>
              取消
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                共 {selectedItems.length} 项，合计 {formatCurrency(totalPrice)}
              </span>
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                className="px-8"
              >
                <Save className="w-4 h-4" />
                提交申请
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
