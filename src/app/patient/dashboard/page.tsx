'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// This page is the patient dashboard.
// After registration, the patient lands here.
// Simple idea: the patient can see their saved data and later submit a case.

interface PatientProfile {
  fullName: string;
  city: string;
  preferredLanguage: string;
}

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleActionLoading, setRoleActionLoading] = useState<string | null>(null);

  // This runs when the page opens. It asks the backend for the patient's saved details.
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  // This function goes to the API and asks for the patient's profile.
  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/patient/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleManagement = async (action: 'change' | 'delete', role?: 'doctor' | 'patient') => {
    setRoleActionLoading(action === 'delete' ? 'delete' : role || 'doctor');

    try {
      const response = await fetch('/api/user/role-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result?.error || 'Unable to update role');
        return;
      }

      if (action === 'delete') {
        alert('Role and saved profile data deleted successfully');
        router.push('/role-selection');
        return;
      }

      alert('Role changed successfully');
      router.push(role === 'doctor' ? '/doctor/registration' : '/patient/registration');
    } catch (error) {
      console.error('Role management error:', error);
      alert('Something went wrong while updating role');
    } finally {
      setRoleActionLoading(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-blue-950">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.9),_transparent_30%),linear-gradient(135deg,_#eff6ff_0%,_#eef2ff_24%,_#f8fbff_100%)] text-slate-800">
      <nav className="border-b border-sky-100 bg-white/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-xl text-white shadow-lg shadow-sky-200">✚</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">MediConnect</h1>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Dashboard</p>
          <h2 className="mt-4 text-3xl font-black text-sky-950">
            Welcome, {profile?.fullName || session?.user?.name}!
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-[2rem] border border-sky-100 bg-white/80 p-6 shadow-[0_20px_60px_rgba(37,99,235,0.08)] backdrop-blur-sm">
            <h3 className="text-xl font-bold text-sky-950 mb-5">Your Profile</h3>
            {profile && (
              <div className="space-y-3 text-sky-900">
                <p className="rounded-2xl bg-sky-50 px-4 py-3"><span className="font-semibold text-sky-950">Name:</span> {profile.fullName}</p>
                <p className="rounded-2xl bg-sky-50 px-4 py-3"><span className="font-semibold text-sky-950">City:</span> {profile.city}</p>
                <p className="rounded-2xl bg-sky-50 px-4 py-3"><span className="font-semibold text-sky-950">Preferred Language:</span> {profile.preferredLanguage}</p>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-indigo-100 bg-white/80 p-6 shadow-[0_20px_60px_rgba(79,70,229,0.08)] backdrop-blur-sm">
            <h3 className="text-xl font-bold text-sky-950 mb-5">Quick Actions</h3>
            <button
              onClick={() => router.push('/patient/cases/new')}
              className="mb-4 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110"
            >
              Submit New Case
            </button>

            <div className="space-y-3 border-t border-sky-100 pt-4">
              <button
                onClick={() => handleRoleManagement('change', 'doctor')}
                disabled={roleActionLoading !== null}
                className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:opacity-60"
              >
                {roleActionLoading === 'doctor' ? 'Changing...' : 'Switch to Doctor'}
              </button>

              <button
                onClick={() => handleRoleManagement('delete')}
                disabled={roleActionLoading !== null}
                className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
              >
                {roleActionLoading === 'delete' ? 'Deleting...' : 'Delete Role & Saved Data'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
