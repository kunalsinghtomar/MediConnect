'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';

export default function RoleSelection() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated' && session?.user && (session.user as any)?.role) {
      const role = (session.user as any).role;
      if (role === 'patient') {
        router.push('/patient/dashboard');
        return;
      }
      if (role === 'doctor') {
        router.push('/doctor/dashboard');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#D9770E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[14px] text-[#555555]">Loading portal credentials...</p>
        </div>
      </div>
    );
  }

  const handleRoleSelection = async (role: 'doctor' | 'patient') => {
    setLoading(true);
    try {
      const response = await fetch('/api/role-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        if (role === 'doctor') {
          router.push('/doctor/registration');
        } else {
          router.push('/patient/registration');
        }
      } else {
        alert('Error saving role selection. Please try again.');
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E2D9] text-[13px] font-medium text-[#0F6B4C] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#0F6B4C]" />
            National AYUSH Health Network
          </div>
          <h1 className="font-heading text-[32px] font-semibold text-[#1A1A1A]">
            Select Portal Access Profile
          </h1>
          <p className="mt-2 text-[16px] text-[#555555] max-w-xl mx-auto">
            Choose your designated profile to proceed with clinical pre-consultation intake or practitioner administrative panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Patient Card */}
          <div
            onClick={() => !loading && handleRoleSelection('patient')}
            className={`card p-8 bg-white border border-[#E8E2D9] rounded-[8px] flex flex-col justify-between transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#D9770E]'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-[8px] bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-center text-[#D9770E] mb-5">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="font-heading text-[24px] font-semibold text-[#1A1A1A] mb-2">
                I am a Patient
              </h2>
              <p className="text-[14px] text-[#555555] leading-relaxed mb-6">
                Record your Ayurvedic symptoms, Agni, and lifestyle history for structured pre-consultation case-taking before meeting your doctor.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleRoleSelection('patient');
              }}
              className="btn-primary w-full"
            >
              {loading ? 'Processing...' : 'Continue as Patient'}
            </button>
          </div>

          {/* Doctor Card */}
          <div
            onClick={() => !loading && handleRoleSelection('doctor')}
            className={`card p-8 bg-white border border-[#E8E2D9] rounded-[8px] flex flex-col justify-between transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#0F6B4C]'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-[8px] bg-[#E8F5EE] border border-[#B7E1CD] flex items-center justify-center text-[#0F6B4C] mb-5">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-heading text-[24px] font-semibold text-[#1A1A1A] mb-2">
                I am a Doctor / Practitioner
              </h2>
              <p className="text-[14px] text-[#555555] leading-relaxed mb-6">
                Access incoming patient case files, perform clinical triage assessment, flag critical complaints, and maintain certified records.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleRoleSelection('doctor');
              }}
              className="btn-secondary w-full"
            >
              {loading ? 'Processing...' : 'Continue as Doctor'}
            </button>
          </div>
        </div>

        <div className="mt-10 text-center text-[13px] text-[#555555]">
          Institutional profiles can be managed or re-assigned under your account settings at any time.
        </div>
      </main>
    </div>
  );
}
