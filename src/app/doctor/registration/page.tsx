'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';

interface DoctorForm {
  fullName: string;
  age: string;
  gender: string;
  phoneNumber: string;
  clinicName: string;
  clinicAddress: string;
  city: string;
  state: string;
  pincode: string;
  consultationLocation: string;
  languages: string;
  medicalQualification: string;
  specialization: string;
  medicalRegistrationNumber: string;
  medicalCouncil: string;
  yearsOfExperience: string;
  areasOfExpertise: string;
  commonConditionsTreated: string;
  consultationType: string;
  verificationDocument: string;
}

const initialForm: DoctorForm = {
  fullName: '',
  age: '',
  gender: '',
  phoneNumber: '',
  clinicName: '',
  clinicAddress: '',
  city: '',
  state: '',
  pincode: '',
  consultationLocation: 'both',
  languages: 'Hindi, English',
  medicalQualification: 'BAMS',
  specialization: 'Kayachikitsa (Internal Medicine)',
  medicalRegistrationNumber: '',
  medicalCouncil: 'National Commission for Indian System of Medicine (NCISM)',
  yearsOfExperience: '',
  areasOfExpertise: 'Metabolic disorders, Joint care, Gut health',
  commonConditionsTreated: 'Agni mandya, Sandhivata, Amlapitta',
  consultationType: 'both',
  verificationDocument: '',
};

export default function DoctorRegistration() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DoctorForm>(initialForm);

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#D9770E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[14px] text-[#555555]">Verifying practitioner credentials...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/doctor/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/doctor/dashboard');
      } else {
        const result = await response.json();
        alert(result?.error || 'Unable to save doctor registration');
      }
    } catch (error) {
      alert('Error registering doctor profile: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = () => (
    <div className="mb-8 pb-4 border-b border-[#E8E2D9]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[12px] font-semibold text-[#0F6B4C] bg-[#E8F5EE] px-2.5 py-0.5 rounded-full border border-[#B7E1CD]">
            NCISM / CCIM Accredited
          </span>
          <h1 className="font-heading text-[28px] font-semibold text-[#1A1A1A] mt-1">
            Doctor Practitioner Onboarding
          </h1>
        </div>
        <span className="text-[13px] font-medium text-[#D9770E] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#FDE68A]">
          Step {step} of 3
        </span>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              s <= step ? 'bg-[#D9770E]' : 'bg-[#E8E2D9]'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="card p-6 sm:p-8 bg-white border border-[#E8E2D9] rounded-[8px]">
          {renderProgress()}

          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <form onSubmit={goNext} className="space-y-4">
              <h2 className="font-heading text-[20px] font-semibold text-[#1A1A1A] mb-4">
                1. Basic Practitioner Profile
              </h2>

              <div>
                <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                  Full Name (with Dr. prefix) <span className="text-[#C0392B]">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Rajesh Varma"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                    Age <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 42"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                    Gender <span className="text-[#C0392B]">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                  >
                    <option value="">Select gender...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                  Registered Contact Number <span className="text-[#C0392B]">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                  Languages Spoken for Consultation
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="e.g. Hindi, English, Sanskrit, Marathi"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="btn-primary">
                  Save & Continue to Clinic Info →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Clinic Information */}
          {step === 2 && (
            <form onSubmit={goNext} className="space-y-4">
              <h2 className="font-heading text-[20px] font-semibold text-[#1A1A1A] mb-4">
                2. Clinic & Hospital Affiliation
              </h2>

              <div>
                <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                  Clinic / Hospital Name <span className="text-[#C0392B]">*</span>
                </label>
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  placeholder="e.g. Government Ayurvedic Dispensary / Clinic"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                  Clinic Address <span className="text-[#C0392B]">*</span>
                </label>
                <input
                  type="text"
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleChange}
                  placeholder="Street, locality, landmark"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                    City / District <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Jaipur"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                    State <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Rajasthan"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                    Pincode <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pin"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20 tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button type="button" onClick={goBack} className="text-[14px] font-medium text-[#555555]">
                  ← Back
                </button>
                <button type="submit" className="btn-primary">
                  Save & Continue to Credentials →
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Professional & Verification */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-heading text-[20px] font-semibold text-[#1A1A1A] mb-4">
                3. Medical Council Registration & Credentials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                    Degree / Medical Qualification <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="text"
                    name="medicalQualification"
                    value={formData.medicalQualification}
                    onChange={handleChange}
                    placeholder="e.g. BAMS, MD (Ayu), MS (Ayu)"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                    Specialization <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Kayachikitsa, Panchakarma, Shalya"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                  Medical Council Registration Number <span className="text-[#C0392B]">*</span>
                </label>
                <input
                  type="text"
                  name="medicalRegistrationNumber"
                  value={formData.medicalRegistrationNumber}
                  onChange={handleChange}
                  placeholder="e.g. NCISM-AYU-5491"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20 font-mono tabular-nums"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                    Registration Medical Council <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="text"
                    name="medicalCouncil"
                    value={formData.medicalCouncil}
                    onChange={handleChange}
                    placeholder="State Ayurvedic Council / NCISM"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                    Years of Clinical Experience <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="e.g. 12"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20 tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button type="button" onClick={goBack} className="text-[14px] font-medium text-[#555555]">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Submitting Registration...' : 'Complete Doctor Registration'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
