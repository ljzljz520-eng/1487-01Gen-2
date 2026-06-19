import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientInfo } from '@/components/PatientInfo';
import { AllergyHistory } from '@/components/AllergyHistory';
import { SignaturePad } from '@/components/SignaturePad';
import { Button } from '@/components/ui';
import { mockPatientData, mockAllergyRecords } from '@/data/mockData';
import type { PatientData, AllergyRecord } from '@/types/patient';
import { AlertCircle, CheckCircle, Stethoscope, ArrowLeft, Save } from 'lucide-react';

export default function InternalMedicineForm() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<Partial<PatientData>>(mockPatientData);
  const [allergyRecords, setAllergyRecords] = useState<AllergyRecord[]>(mockAllergyRecords);
  const [signatureData, setSignatureData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const allErrors: string[] = [];

    if (typeof (window as any).validatePatientInfo === 'function') {
      const patientErrors = (window as any).validatePatientInfo();
      if (patientErrors.length > 0) {
        allErrors.push(...patientErrors.map((e: any) => e.message));
      }
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
      signatureData,
      formType: 'internal-medicine-admission',
      submittedAt: new Date().toISOString()
    };

    console.log('提交的表单数据:', formData);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  const handleReset = () => {
    setPatientData({});
    setAllergyRecords([]);
    setSignatureData('');
    setErrors([]);
    setSubmitSuccess(false);
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
            <div className="w-12 h-12 rounded-full bg-medical-blue-100 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-medical-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">内科入院记录</h1>
              <p className="text-slate-500">Internal Medicine Admission Record</p>
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
                表单提交成功！已保存到系统中。
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
              address: { required: false },
              bloodType: { required: false },
              maritalStatus: { required: false }
            }}
            maskSensitiveData={false}
            showMaskToggle={true}
          />

          <AllergyHistory
            value={allergyRecords}
            onChange={setAllergyRecords}
            required={false}
            maxRecords={5}
            allowAdd={true}
            allowDelete={true}
            allowEdit={true}
            maskSensitiveData={false}
            showMaskToggle={true}
          />

          <SignaturePad
            value={signatureData}
            onChange={setSignatureData}
            required={true}
            width={700}
            height={200}
            penColor="#1a1a1a"
            penWidth={2}
            showClearButton={true}
            showUndoButton={true}
            showConfirmButton={true}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <Button variant="secondary" onClick={handleReset}>
              重置表单
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              className="px-8"
            >
              <Save className="w-4 h-4" />
              提交入院记录
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
