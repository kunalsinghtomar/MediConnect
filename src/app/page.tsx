'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// This is the public homepage
// Users see this page when they first visit the application
// It explains what the app does and provides a login button

export default function Home() {
  const router = useRouter();

  // This function handles the Google login button click
  // It uses NextAuth to start the Google OAuth login process
  const handleGoogleLogin = async () => {
    // Start Google login and redirect directly to the role selection page
    // after the user allows access.
    await signIn('google', {
      callbackUrl: '/role-selection',
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.9),_transparent_30%),linear-gradient(135deg,_#eef6ff_0%,_#e0f2fe_28%,_#f8fbff_100%)] text-slate-800">
      <nav className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-200 flex items-center justify-center">
                <span className="text-xl">✚</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">MediConnect</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Trusted healthcare access
            </div>

            <div className="space-y-5">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                Connect with <span className="bg-gradient-to-r from-sky-600 to-indigo-700 bg-clip-text text-transparent">Verified Doctors</span>
              </h2>
              <p className="text-xl text-slate-600 leading-8 max-w-xl">
                Get expert medical advice from verified doctors in your preferred language.
                Simple, secure, and reliable healthcare at your fingertips.
              </p>
            </div>

            <div className="space-y-4 max-w-xl">
              {[
                'Verified Doctors: All doctors are verified and registered',
                'Multilingual Support: Get help in your preferred language',
                'Secure & Private: Your medical information is protected',
                'Quick Registration: Patients can sign up in minutes',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 rounded-2xl border border-sky-100 bg-white/75 p-4 shadow-sm shadow-sky-50">
                  <div className="flex-shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white shadow-md shadow-emerald-200">✓</div>
                  <p className="text-slate-700 leading-6">
                    <span className="font-semibold text-slate-800">{item.split(':')[0]}:</span> {item.split(':').slice(1).join(':').trim()}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleGoogleLogin}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-300"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg font-bold">G</span>
              Login with Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-sky-200/60 to-indigo-200/60 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_24px_80px_rgba(59,130,246,0.12)] backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-8 h-[440px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-sky-500 to-indigo-600 text-5xl shadow-xl shadow-indigo-200">🏥</div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">Healthcare Platform</p>
                    <p className="mt-2 text-slate-600">Connecting Patients with Doctors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-sky-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              ['For Patients', 'Find expert doctors and get medical advice'],
              ['For Doctors', 'Expand your practice and help more patients'],
              ['Secure', 'All data is encrypted and protected'],
            ].map(([title, text], index) => (
              <div key={index} className="rounded-2xl border border-sky-100 bg-white/80 p-5 shadow-sm shadow-sky-50">
                <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
                <p className="text-slate-600 text-sm leading-6">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
