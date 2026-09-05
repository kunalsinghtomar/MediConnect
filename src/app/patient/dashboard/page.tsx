'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { StatusChip } from '@/components/StatusChip';

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
  const [cases, setCases] = useState<any[]>([]);
  const [roleActionLoading, setRoleActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
      fetchCases();
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

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

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/patient/cases');
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases || []);
      }
    } catch (error) {
      console.error('Error fetching patient cases:', error);
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
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#D9770E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[14px] text-[#555555]">Loading patient dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E2D9] text-[13px] font-medium text-[#0F6B4C] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#0F6B4C]" />
              Patient Pre-Consultation Portal
            </div>
            <h1 className="font-heading text-[32px] font-semibold text-[#1A1A1A]">
              Welcome, {profile?.fullName || session?.user?.name || 'Patient'}
            </h1>
            <p className="text-[14px] text-[#555555] mt-1">
              Submit new symptoms for pre-consultation review or monitor existing case files.
            </p>
          </div>

          <div>
            <Link
              href="/patient/case-taking"
              className="btn-primary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Start AYUSH Case Intake</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Case Taking History Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 bg-white border border-[#E8E2D9] rounded-[8px]">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9] mb-4">
                <h2 className="font-heading text-[20px] font-semibold text-[#1A1A1A]">
                  Your Pre-Consultation Cases
                </h2>
                <span className="text-[13px] text-[#555555]">
                  {cases.length} active records
                </span>
              </div>

              {cases.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-[#E8E2D9] rounded-[8px] p-6 bg-[#FAF7F2]">
                  <div className="w-12 h-12 rounded-full bg-white text-[#D9770E] border border-[#E8E2D9] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-[16px] font-semibold text-[#1A1A1A]">
                    No case intakes filed yet
                  </h3>
                  <p className="text-[14px] text-[#555555] mt-1 max-w-sm mx-auto">
                    Fill out the multi-step Ayurvedic anamnesis form before your doctor consultation.
                  </p>
                  <Link
                    href="/patient/case-taking"
                    className="btn-primary mt-4"
                  >
                    Start First Case Intake
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {cases.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-[8px] border border-[#E8E2D9] hover:bg-[#FAF7F2] transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[13px] text-[#555555] tabular-nums">
                            {c.id.slice(0, 8)}
                          </span>
                          <span className="font-semibold text-[15px] text-[#1A1A1A]">
                            {c.title || 'Ayurvedic Case Intake'}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#555555] mt-1">
                          Duration: {c.duration || 'N/A'} · Severity: {c.severity || 'Moderate'}
                        </p>
                      </div>
                      <div>
                        <StatusChip status={c.status || 'pending'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Institutional Care Card */}
            <div className="card p-6 bg-white border border-[#E8E2D9] rounded-[8px]">
              <h3 className="font-heading text-[18px] font-semibold text-[#1A1A1A] mb-2">
                What Happens After Case Submission?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-[14px]">
                <div className="p-3 bg-[#FAF7F2] rounded-[6px] border border-[#E8E2D9]">
                  <div className="font-semibold text-[#D9770E] mb-1">1. Triage Review</div>
                  <p className="text-[#555555] text-[13px]">
                    Verified doctor reviews your Agni, Prakriti, and symptom trajectory.
                  </p>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-[6px] border border-[#E8E2D9]">
                  <div className="font-semibold text-[#0F6B4C] mb-1">2. Case Flagging</div>
                  <p className="text-[#555555] text-[13px]">
                    Acute conditions get prioritized for immediate video/in-clinic triage.
                  </p>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-[6px] border border-[#E8E2D9]">
                  <div className="font-semibold text-[#1A1A1A] mb-1">3. Consultation</div>
                  <p className="text-[#555555] text-[13px]">
                    Practitioner arrives prepared with your full Ayurvedic profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile & Account Actions Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 bg-white border border-[#E8E2D9] rounded-[8px]">
              <h3 className="font-heading text-[18px] font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-[#E8E2D9]">
                Registered Patient Details
              </h3>
              {profile ? (
                <div className="space-y-3 text-[14px]">
                  <div>
                    <span className="text-[#555555] block text-[13px]">Full Name</span>
                    <span className="font-medium text-[#1A1A1A]">{profile.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#555555] block text-[13px]">District / City</span>
                    <span className="font-medium text-[#1A1A1A]">{profile.city}</span>
                  </div>
                  <div>
                    <span className="text-[#555555] block text-[13px]">Consultation Language</span>
                    <span className="font-medium text-[#1A1A1A]">{profile.preferredLanguage}</span>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0F6B4C] bg-[#E8F5EE] px-2.5 py-1 rounded-full border border-[#B7E1CD]">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verified Patient Profile
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[14px] text-[#555555]">Profile information pending registration.</p>
              )}
            </div>

            <div className="card p-6 bg-white border border-[#E8E2D9] rounded-[8px]">
              <h3 className="font-heading text-[18px] font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-[#E8E2D9]">
                Role & Account Settings
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleRoleManagement('change', 'doctor')}
                  disabled={roleActionLoading !== null}
                  className="btn-secondary w-full"
                >
                  {roleActionLoading === 'doctor' ? 'Switching...' : 'Switch to Doctor Role'}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleManagement('delete')}
                  disabled={roleActionLoading !== null}
                  className="btn-destructive w-full"
                >
                  {roleActionLoading === 'delete' ? 'Deleting...' : 'Reset Role & Profile Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
