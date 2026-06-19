import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientInfo } from '@/components/PatientInfo';
import { AllergyHistory } from '@/components/AllergyHistory';
import { TestItemSelector } from '@/components/TestItemSelector';
import { SignaturePad } from '@/components/SignaturePad';
import { Button } from '@/components/ui';
import { mockTestCategories, mockPatientData } from '@/data/mockData';
import type { PatientData, AllergyRecord, TestItem } from '@/types/patient';
import { AlertCircle, CheckCircle, Scissors, ArrowLeft, Save, FileWarning } from 'lucide-react';

export default function SurgeryForm() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<Partial<PatientData>>(mockPatientData);
  const [allergyRecords, setAllergyRecords] = useState<AllergyRecord[]>([]);
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [selectedTestItems, setSelectedTestItems] = useState<TestItem[]>([]);
  const [signatureData, setSignatureData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validateForm = (): boolean => {
    const allErrors: string[] = [];

    if (typeof (window as any).validatePatientInfo === 'function') {
      const patientErrors = (window as any).validatePatientInfo();
      if (patientErrors.length > 0) {
        allErrors.push(...patientErrors.map((e: any) => e.message));
      }
    }

    if (selectedTestIds.length === 0) {
      allErrors.push('请至少选择一项术前检查项目');
    }

    if (!agreeToTerms) {
      allErrors.push('请阅读并同意手术知情同意书');
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
      allergyRecords,
      preOpTests: selectedTestItems,
      signatureData,
      agreeToTerms,
      formType: 'surgery-consent',
      submittedAt: new Date().toISOString()
    };

    console.log('提交的手术知情同意书:', formData);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-medical-red-100 flex items-center justify-center">
              <Scissors className="w-6 h-6 text-medical-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">外科手术知情同意书</h1>
              <p className="text-slate-500">Surgical Informed Consent Form</p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-medical-orange-50 border border-medical-orange-200 rounded-xl">
          <div className="flex items-start gap-3">
            <FileWarning className="w-5 h-5 text-medical-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-medical-orange-800 mb-1">手术风险告知</h4>
              <p className="text-sm text-medical-orange-700">
                本表单涉及重大医疗决策，请务必如实填写患者信息，并确认所有术前检查项目已完成。
                患者或家属需在充分理解手术风险后签署本同意书。
              </p>
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
                手术知情同意书已签署成功！已自动归档到患者病历系统。
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
              idCard: { required: true },
              phone: { required: true },
              address: { required: true },
              bloodType: { required: true },
              maritalStatus: { required: false }
            }}
            maskSensitiveData={false}
            showMaskToggle={true}
          />

          <AllergyHistory
            value={allergyRecords}
            onChange={setAllergyRecords}
            required={true}
            maxRecords={10}
            allowAdd={true}
            allowDelete={true}
            allowEdit={true}
            maskSensitiveData={false}
            showMaskToggle={true}
          />

          <TestItemSelector
            categories={mockTestCategories}
            value={selectedTestIds}
            onChange={(ids, items) => {
              setSelectedTestIds(ids);
              setSelectedTestItems(items);
            }}
            required={true}
            showPrice={true}
            allowPackage={true}
            showSelectedSummary={true}
            searchable={true}
          />

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">手术知情同意声明</h3>
            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 leading-relaxed mb-4 max-h-48 overflow-y-auto scrollbar-thin">
              <p className="mb-3"><strong>手术名称：</strong>腹腔镜胆囊切除术</p>
              <p className="mb-3"><strong>手术指征：</strong>胆囊结石伴慢性胆囊炎</p>
              <p className="mb-3"><strong>手术目的：</strong>切除病变胆囊，解除症状，预防并发症</p>
              <p className="mb-3"><strong>预期效果：</strong>消除症状，恢复正常生活质量</p>
              
              <h4 className="font-semibold text-slate-700 mt-4 mb-2">手术风险告知：</h4>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>麻醉相关风险：过敏反应、呼吸抑制、心血管意外等</li>
                <li>手术中可能出现的风险：出血、胆管损伤、邻近器官损伤</li>
                <li>手术后可能出现的并发症：出血、感染、胆漏、结石残留</li>
                <li>其他不可预见的医疗风险</li>
              </ul>
              
              <p className="mb-3">
                我已了解上述手术的目的、意义、必要性及可能存在的风险。我理解任何手术都存在风险，
                医生已向我详细解释了以上风险。我愿意接受手术并承担相应风险。
              </p>
              
              <p className="font-semibold">
                我确认已如实告知医生我的健康状况、既往病史、过敏史及正在服用的药物。
              </p>
            </div>
            
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-medical-blue-500 rounded border-slate-300 focus:ring-medical-blue-500"
              />
              <span className="text-sm text-slate-700">
                我已仔细阅读并理解以上全部内容，同意接受手术治疗，自愿签署本知情同意书。
              </span>
            </label>
          </div>

          <SignaturePad
            value={signatureData}
            onChange={setSignatureData}
            required={true}
            width={700}
            height={200}
            penColor="#1a1a1a"
            penWidth={2}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <Button variant="secondary" onClick={() => navigate('/')}>
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              className="px-8"
            >
              <Save className="w-4 h-4" />
              确认签署
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
