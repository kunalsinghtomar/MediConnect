'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  languages: '',
  medicalQualification: '',
  specialization: '',
  medicalRegistrationNumber: '',
  medicalCouncil: '',
  yearsOfExperience: '',
  areasOfExpertise: '',
  commonConditionsTreated: '',
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/doctor/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result?.error || 'Unable to save doctor registration');
        return;
      }

      router.push('/doctor/dashboard');
    } catch (error) {
      alert('Something went wrong while saving doctor profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-3xl font-black text-sky-950">Doctor Registration</h2>
        <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Step {step} of 3</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-sky-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <div className="med-shell min-h-screen py-12">
        <nav className="mb-12 border-b border-sky-100 bg-white/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-xl text-white shadow-lg shadow-sky-200">✚</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">MediConnect</h1>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto rounded-[2rem] border border-sky-100 bg-white/80 p-8 shadow-[0_24px_80px_rgba(14,116,144,0.08)] backdrop-blur-sm">
          {renderProgress()}
          <h3 className="mb-6 text-xl font-bold text-sky-950">Basic Information</h3>

          <form onSubmit={goNext} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-950">Full Name *</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Age *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-950">Phone Number *</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-950">Clinic/Hospital Name *</label>
              <input name="clinicName" value={formData.clinicName} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-950">Clinic Address *</label>
              <textarea name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} required rows={3} className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">City *</label>
                <input name="city" value={formData.city} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">State *</label>
                <input name="state" value={formData.state} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Pincode *</label>
                <input name="pincode" value={formData.pincode} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Consultation Location *</label>
                <select name="consultationLocation" value={formData.consultationLocation} onChange={handleChange} className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white">
                  <option value="in-person">In-person only</option>
                  <option value="online">Online only</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Languages *</label>
                <input name="languages" value={formData.languages} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110">Next Step</button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="med-shell min-h-screen py-12">
        <nav className="mb-12 border-b border-sky-100 bg-white/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-xl text-white shadow-lg shadow-sky-200">✚</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">MediConnect</h1>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto rounded-[2rem] border border-sky-100 bg-white/80 p-8 shadow-[0_24px_80px_rgba(14,116,144,0.08)] backdrop-blur-sm">
          {renderProgress()}
          <h3 className="mb-6 text-xl font-bold text-sky-950">Professional Details</h3>

          <form onSubmit={goNext} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Medical Qualification *</label>
                <input name="medicalQualification" value={formData.medicalQualification} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Specialization *</label>
                <input name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Registration Number *</label>
                <input name="medicalRegistrationNumber" value={formData.medicalRegistrationNumber} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Medical Council *</label>
                <input name="medicalCouncil" value={formData.medicalCouncil} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Years of Experience *</label>
                <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-950">Consultation Type *</label>
                <select name="consultationType" value={formData.consultationType} onChange={handleChange} className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white">
                  <option value="in-person">In-person</option>
                  <option value="online">Online</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-950">Areas of Expertise *</label>
              <input name="areasOfExpertise" value={formData.areasOfExpertise} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-950">Common Conditions Treated *</label>
              <input name="commonConditionsTreated" value={formData.commonConditionsTreated} onChange={handleChange} required className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={goBack} className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700">Back</button>
              <button type="submit" className="flex-1 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110">Next Step</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="med-shell min-h-screen py-12">
      <nav className="mb-12 border-b border-sky-100 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-xl text-white shadow-lg shadow-sky-200">✚</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">MediConnect</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto rounded-[2rem] border border-sky-100 bg-white/80 p-8 shadow-[0_24px_80px_rgba(14,116,144,0.08)] backdrop-blur-sm">
        {renderProgress()}
        <h3 className="mb-6 text-xl font-bold text-sky-950">Verification</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-sky-950">Verification Document URL</label>
            <input name="verificationDocument" value={formData.verificationDocument} onChange={handleChange} placeholder="Optional PDF/Document URL" className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white" />
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-sm text-sky-900">
            Your profile will be submitted for verification. After approval, your doctor dashboard will become active.
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={goBack} className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700">Back</button>
            <button type="submit" disabled={loading} className="flex-1 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 disabled:opacity-60">
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
