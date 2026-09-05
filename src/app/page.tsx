'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Header } from '@/components/Header';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated') {
      const role = (session?.user as any)?.role;
      if (role === 'patient') {
        router.replace('/patient/dashboard');
      } else if (role === 'doctor') {
        router.replace('/doctor/dashboard');
      } else {
        router.replace('/role-selection');
      }
    }
  }, [status, session, router]);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    await signIn('google', {
      callbackUrl: '/role-selection',
      redirect: true,
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#D9770E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[14px] text-[#555555] font-medium">Verifying institutional credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <Header />

      {/* Hero & Login Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Institutional Badge */}
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E2D9] text-[13px] font-medium text-[#0F6B4C]">
              <span className="w-2 h-2 rounded-full bg-[#0F6B4C]" />
              Government of India · Ministry of AYUSH Standards Compliant
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Hero Frame */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="mb-4">
                <h1 className="text-[32px] sm:text-[36px] font-heading font-semibold text-[#1A1A1A] leading-[40px] sm:leading-[44px]">
                  AYUSH Pre-Consultation & Clinical Case-Taking Portal
                </h1>
                <p className="mt-3 text-[16px] text-[#555555] leading-relaxed">
                  Connecting citizens with verified Ayurvedic practitioners. Complete your standardized pre-consultation intake prior to your appointment for precise clinical evaluation.
                </p>
              </div>

              {/* Framed Hero Image Container */}
              <div className="rounded-[8px] border border-[#E8E2D9] bg-[#FAF7F2] p-3 sm:p-4 shadow-none">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[6px] border border-[#E8E2D9] bg-white">
                  <Image
                    src="/images/doctor-patient-hero.png"
                    alt="Doctor and patient in calm, natural Ayurvedic pre-consultation conversation"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[13px] text-[#555555] px-1">
                  <span>Standardized Ayurvedic Clinical Protocol (CCIM / NCISM)</span>
                  <span className="text-[#0F6B4C] font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Certified Practitioner Care
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Only Google Login Card */}
            <div className="lg:col-span-5">
              <div className="card p-6 sm:p-8 bg-white border border-[#E8E2D9] rounded-[8px]">
                {/* Header of Card */}
                <div className="text-center pb-6 border-b border-[#E8E2D9]">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-[8px] bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-center text-[#D9770E]">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
                      <circle cx="12" cy="12" r="9" strokeWidth={1.5} className="text-[#0F6B4C]" stroke="currentColor" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-[24px] font-semibold text-[#1A1A1A] leading-[32px]">
                    Sign In to MediConnect
                  </h2>
                  <p className="mt-1 text-[14px] text-[#555555]">
                    Official authentication for citizens and verified medical practitioners
                  </p>
                </div>

                {/* Google Sign-In Action Area */}
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px] text-[13px] text-[#555555] leading-relaxed">
                    <p className="font-medium text-[#1A1A1A] mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0F6B4C]" />
                      Single Sign-On (SSO) Portal
                    </p>
                    Sign in securely with your Google account to access your patient case records or practitioner clinical review dashboard.
                  </div>

                  {/* Sole Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isSigningIn}
                    className="w-full min-h-[48px] px-6 rounded-[8px] border border-[#E8E2D9] bg-white hover:bg-[#FAF7F2] hover:border-[#D9770E] text-[15px] font-medium text-[#1A1A1A] flex items-center justify-center gap-3 transition-all duration-150 shadow-none hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] disabled:opacity-60"
                  >
                    {isSigningIn ? (
                      <span className="flex items-center gap-2 text-[#555555]">
                        <span className="w-4 h-4 border-2 border-[#D9770E] border-t-transparent rounded-full animate-spin" />
                        Connecting to Google...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign in with Google</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-[13px] text-[#555555]">
                      First time visiting? Signing in will automatically guide you to choose between Patient intake and Doctor onboarding.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E8E2D9] flex items-center justify-between text-[12px] text-[#0F6B4C]">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                      </svg>
                      Verified OAuth 2.0
                    </span>
                    <span className="text-[#8C827A]">256-bit SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Row Below The Fold */}
          <div className="mt-14 pt-8 border-t border-[#E8E2D9]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-4 bg-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E8F5EE] text-[#0F6B4C] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#1A1A1A]">Verified Doctors</h3>
                  <p className="text-[13px] text-[#555555]">NCISM / CCIM credential checked</p>
                </div>
              </div>

              <div className="card p-4 bg-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E8F5EE] text-[#0F6B4C] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#1A1A1A]">AYUSH Certified</h3>
                  <p className="text-[13px] text-[#555555]">Standardized Ayurvedic anamnesis</p>
                </div>
              </div>

              <div className="card p-4 bg-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E8F5EE] text-[#0F6B4C] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#1A1A1A]">Government Tele-Triage</h3>
                  <p className="text-[13px] text-[#555555]">Pre-consultation intake workflow</p>
                </div>
              </div>

              <div className="card p-4 bg-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E8F5EE] text-[#0F6B4C] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#1A1A1A]">Data Protection</h3>
                  <p className="text-[13px] text-[#555555]">Encrypted medical records</p>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Context Row */}
          <div className="mt-12 p-6 bg-white border border-[#E8E2D9] rounded-[8px]">
            <div className="max-w-3xl">
              <h2 className="font-heading text-[20px] font-semibold text-[#1A1A1A] mb-2">
                Standard Ayurvedic Pre-Consultation Protocol
              </h2>
              <p className="text-[14px] text-[#555555] leading-relaxed">
                Prior to your clinical consultation, patients submit their detailed symptom history, digestive fire assessment (Agni), and lifestyle metrics. This structured case intake reduces doctor consultation prep time and ensures higher diagnostic accuracy under institutional guidelines.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-[#E8E2D9] py-6 text-center text-[13px] text-[#555555]">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 MediConnect · Ministry of AYUSH Pre-Consultation Framework · All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
