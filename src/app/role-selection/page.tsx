'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// This page asks the user: "Are you a patient or a doctor?"
// Simple meaning: after Google login, we decide which form should open next.
// If the user already chose a role before, we skip this page and send them to their dashboard.

export default function RoleSelection() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  // This effect runs when login status changes.
  // It protects the page and redirects old users to the correct dashboard.
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

  // If login is still loading, show this until session is ready.
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-lg text-blue-950">Loading...</div>
        </div>
      </div>
    );
  }

  // This function saves the selected role to the database
  // Then redirects to the appropriate registration page
  const handleRoleSelection = async (role: 'doctor' | 'patient') => {
    setLoading(true);
    try {
      // Send request to save the role in the database
      const response = await fetch('/api/role-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        // Redirect based on selected role
        if (role === 'doctor') {
          router.push('/doctor/registration');
        } else {
          router.push('/patient/registration');
        }
      } else {
        alert('Error saving role. Please try again.');
      }
    } catch (error) {
      alert('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="med-shell min-h-screen">
      <nav className="border-b border-sky-100 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-200 text-xl text-white">✚</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">MediConnect</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">Choose your profile</p>
          <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Welcome to <span className="bg-gradient-to-r from-sky-600 to-indigo-700 bg-clip-text text-transparent">MediConnect</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Please tell us who you are so we can personalize your experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            onClick={() => !loading && handleRoleSelection('doctor')}
            className={`group relative overflow-hidden rounded-[2rem] border border-sky-100 bg-white/80 p-8 shadow-[0_20px_60px_rgba(14,116,144,0.08)] backdrop-blur-sm transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(59,130,246,0.14)]'
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-600" />
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-3xl shadow-lg shadow-sky-200">👨‍⚕️</div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">I'm a Doctor</h3>
            <p className="text-slate-600 leading-7 mb-6">
              Register your medical practice, get verified, and help patients with their health concerns.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                !loading && handleRoleSelection('doctor');
              }}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Processing...' : 'Continue as Doctor'}
            </button>
          </div>

          <div
            onClick={() => !loading && handleRoleSelection('patient')}
            className={`group relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-white/80 p-8 shadow-[0_20px_60px_rgba(79,70,229,0.08)] backdrop-blur-sm transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(99,102,241,0.12)]'
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-600" />
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl shadow-lg shadow-indigo-200">👤</div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">I'm a Patient</h3>
            <p className="text-slate-600 leading-7 mb-6">
              Describe your health concerns and get help from verified doctors.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                !loading && handleRoleSelection('patient');
              }}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Processing...' : 'Continue as Patient'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500">You can change your role later if needed.</p>
        </div>
      </div>
    </div>
  );
}
