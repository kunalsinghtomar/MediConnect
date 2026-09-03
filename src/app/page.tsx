'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This is the public homepage.
// It shows the login page only when the user is not already logged in.
// If a valid session already exists, we redirect the user to their dashboard immediately.

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // If the user is already logged in, send them to the right page.
  // This prevents the homepage from appearing again when the user reloads the app.
  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'authenticated') {
      const role = (session?.user as any)?.role;

      if (role === 'patient') {
        router.replace('/patient/dashboard');
        return;
      }

      if (role === 'doctor') {
        router.replace('/doctor/dashboard');
        return;
      }

      router.replace('/role-selection');
    }
  }, [status, session, router]);

  // This function handles the Google login button click.
  // It uses NextAuth to start the Google OAuth login process.
  const handleGoogleLogin = async () => {
    // Start Google login and redirect directly to the role selection page
    // after the user allows access.
    await signIn('google', {
      callbackUrl: '/role-selection',
      redirect: true,
    });
  };

  // If the user is still loading, show a simple loading screen.
  if (status === 'loading') {
    return (
      <div className="med-shell min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-emerald-800">Loading...</div>
      </div>
    );
  }

  // If the user is not logged in, show the normal landing page with login button.
  if (status === 'unauthenticated') {
    return (
      <div className="med-shell min-h-screen">
        <nav className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="med-mark">
                  <span>+</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-lime-700 bg-clip-text text-transparent">MediConnect</h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-lime-500" />
                Trusted healthcare access
              </div>

              <div className="space-y-5">
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                  Connect with <span className="bg-gradient-to-r from-emerald-600 to-lime-700 bg-clip-text text-transparent">Verified Doctors</span>
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
                  <div key={index} className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-white/75 p-4 shadow-sm shadow-emerald-50">
                    <div className="flex-shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-sm font-bold text-white shadow-md shadow-emerald-200">✓</div>
                    <p className="text-slate-700 leading-6">
                      <span className="font-semibold text-slate-800">{item.split(':')[0]}:</span> {item.split(':').slice(1).join(':').trim()}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGoogleLogin}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-lime-600 to-green-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg font-bold">G</span>
                Login with Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-200/60 to-lime-200/60 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_24px_80px_rgba(16,185,129,0.12)] backdrop-blur-xl">
                {/* This visual represents a doctor and patient meeting through MediConnect. */}
                <div className="med-care-scene relative h-[440px] overflow-hidden rounded-[1.5rem] p-8">
                  <div className="med-signal med-pulse absolute left-[18%] top-[22%] h-24 w-24 rounded-full border border-cyan-300/50" />
                  <div className="med-signal absolute right-[16%] top-[34%] h-32 w-32 rounded-full border border-fuchsia-300/40" />
                  <div className="absolute bottom-16 left-[20%] text-center">
                    <div className="med-person med-doctor mx-auto"><span>+</span></div>
                    <p className="mt-3 text-xs uppercase tracking-[0.28em] text-cyan-200">Verified doctor</p>
                  </div>
                  <div className="absolute bottom-16 right-[20%] text-center">
                    <div className="med-person med-patient mx-auto"><span>•</span></div>
                    <p className="mt-3 text-xs uppercase tracking-[0.28em] text-fuchsia-200">Patient care</p>
                  </div>
                  <div className="absolute left-1/2 top-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-cyan-300 to-fuchsia-300 shadow-[0_0_18px_rgba(99,230,255,0.9)]" />
                  <p className="absolute bottom-5 left-0 right-0 text-center text-sm text-slate-300">One secure space for better care</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-emerald-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                ['For Patients', 'Find expert doctors and get medical advice'],
                ['For Doctors', 'Expand your practice and help more patients'],
                ['Secure', 'All data is encrypted and protected'],
              ].map(([title, text], index) => (
                <div key={index} className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm shadow-emerald-50">
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

  return null;
}
