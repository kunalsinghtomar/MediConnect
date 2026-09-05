'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';

interface FormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  city: string;
  preferredLanguage: string;
}

export default function PatientRegistration() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    city: '',
    preferredLanguage: 'English',
  });

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#D9770E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[14px] text-[#555555]">Verifying patient session...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/patient/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/patient/case-taking');
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      alert('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="card p-6 sm:p-8 bg-white border border-[#E8E2D9] rounded-[8px]">
          <div className="mb-6 pb-4 border-b border-[#E8E2D9]">
            <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0F6B4C] bg-[#E8F5EE] px-2.5 py-1 rounded-full border border-[#B7E1CD] mb-2">
              <span>Patient Profile Registration</span>
            </div>
            <h1 className="font-heading text-[28px] font-semibold text-[#1A1A1A]">
              Patient Demographic Registration
            </h1>
            <p className="mt-1 text-[14px] text-[#555555]">
              Please register your baseline personal details before starting clinical case-taking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                Full Legal Name <span className="text-[#C0392B]">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Ramesh Chandra Sharma"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                Date of Birth <span className="text-[#C0392B]">*</span>
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                Gender <span className="text-[#C0392B]">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
              >
                <option value="">Select gender...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                Mobile Contact Number <span className="text-[#C0392B]">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                City / District of Residence <span className="text-[#C0392B]">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. Jaipur, Bengaluru, Varanasi"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
              />
            </div>

            <div>
              <label htmlFor="preferredLanguage" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                Preferred Consultation Language <span className="text-[#C0392B]">*</span>
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              </select>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Registering Demographic File...' : 'Complete Registration & Proceed'}
              </button>
            </div>

            <p className="text-center text-[13px] text-[#555555]">
              Fields with <span className="text-[#C0392B] font-semibold">*</span> are required for clinical identification under AYUSH EHR standards.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
