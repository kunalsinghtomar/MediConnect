'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DoctorProfile {
  fullName: string;
  clinicName: string;
  city: string;
  specialization: string;
  verificationStatus: string;
}

export default function DoctorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleActionLoading, setRoleActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/doctor/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleManagement = async (action: 'change' | 'delete', role?: 'doctor' | 'patient') => {
    setRoleActionLoading(action === 'delete' ? 'delete' : role || 'patient');

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
      router.push(role === 'patient' ? '/patient/registration' : '/doctor/registration');
    } catch (error) {
      console.error('Role management error:', error);
      alert('Something went wrong while updating role');
    } finally {
      setRoleActionLoading(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-lg text-gray-600">Loading doctor dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.9),_transparent_30%),linear-gradient(135deg,_#eff6ff_0%,_#eef2ff_24%,_#f8fbff_100%)] text-slate-800">
      <nav className="border-b border-sky-100 bg-white/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-xl text-white shadow-lg shadow-sky-200">✚</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">MediConnect</h1>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Doctor Dashboard</p>
          <h2 className="mt-4 text-3xl font-black text-sky-950">
            Welcome, {profile?.fullName || session?.user?.name || 'Doctor'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-[2rem] border border-sky-100 bg-white/80 p-6 shadow-[0_20px_60px_rgba(37,99,235,0.08)] backdrop-blur-sm lg:col-span-2">
            <h3 className="text-xl font-bold text-sky-950 mb-5">Profile Summary</h3>
            {profile ? (
              <div className="space-y-3 text-sm text-sky-900">
                <p className="rounded-2xl bg-sky-50 px-4 py-3"><span className="font-semibold text-sky-950">Clinic:</span> {profile.clinicName}</p>
                <p className="rounded-2xl bg-sky-50 px-4 py-3"><span className="font-semibold text-sky-950">City:</span> {profile.city}</p>
                <p className="rounded-2xl bg-sky-50 px-4 py-3"><span className="font-semibold text-sky-950">Specialization:</span> {profile.specialization}</p>
                <p className="rounded-2xl bg-sky-50 px-4 py-3">
                  <span className="font-semibold text-sky-950">Verification Status:</span>
                  <span className="ml-3 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    {profile.verificationStatus}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-slate-500">Profile not found.</p>
            )}
          </div>

          <div className="rounded-[2rem] border border-indigo-100 bg-white/80 p-6 shadow-[0_20px_60px_rgba(79,70,229,0.08)] backdrop-blur-sm">
            <h3 className="text-xl font-bold text-sky-950 mb-5">Actions</h3>
            <button
              onClick={() => router.push('/doctor/registration')}
              className="mb-4 w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110"
            >
              Edit Registration
            </button>

            <div className="space-y-3 border-t border-sky-100 pt-4">
              <button
                onClick={() => handleRoleManagement('change', 'patient')}
                disabled={roleActionLoading !== null}
                className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:opacity-60"
              >
                {roleActionLoading === 'patient' ? 'Changing...' : 'Switch to Patient'}
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
      </main>
    </div>
  );
}
