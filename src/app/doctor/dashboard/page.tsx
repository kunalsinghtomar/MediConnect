'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatusChip } from '@/components/StatusChip';

interface CaseItem {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  city: string;
  chiefComplaint: string;
  duration: string;
  severity: string;
  status: 'pending' | 'reviewed' | 'flagged';
  submittedDate: string;
  details: {
    chiefComplaint?: string;
    duration?: string;
    severity?: string;
    onset?: string;
    aggravatingFactors?: string;
    appetite?: string;
    bowelHabits?: string;
    postMealSensation?: string;
    thirstPattern?: string;
    sleepQuality?: string;
    physicalActivity?: string;
    stressLevel?: string;
    dietPreference?: string;
    thermalPreference?: string;
    skinType?: string;
    energyPattern?: string;
    chronicConditions?: string;
    currentMedications?: string;
    allergies?: string;
    notes?: string;
    [key: string]: any;
  };
}

export default function DoctorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Navigation Sidebar State
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'patients' | 'settings'>('pending');

  // Cases and filtering state
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'flagged'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Selected case for right-side drawer view
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [actionProcessing, setActionProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/doctor/cases');
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases || []);
      }
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (caseId: string, action: 'review' | 'flag') => {
    setActionProcessing(action);
    try {
      const response = await fetch('/api/doctor/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, action }),
      });

      if (response.ok) {
        const newStatus = action === 'review' ? 'reviewed' : 'flagged';
        setCases((prev) =>
          prev.map((c) => (c.id === caseId ? { ...c, status: newStatus as any } : c))
        );
        if (selectedCase && selectedCase.id === caseId) {
          setSelectedCase((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (error) {
      console.error('Failed to update case status:', error);
    } finally {
      setActionProcessing(null);
    }
  };

  // Tab filtered and search filtered cases
  const filteredCases = useMemo(() => {
    return cases
      .filter((c) => {
        // Sidebar tab constraint
        if (activeTab === 'pending') {
          if (c.status !== 'pending' && c.status !== 'flagged') return false;
        } else if (activeTab === 'history') {
          if (c.status !== 'reviewed') return false;
        }

        // Top Filter by Status
        if (statusFilter !== 'all' && c.status !== statusFilter) {
          return false;
        }

        // Top Filter by Patient Name or Case ID
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.patientName?.toLowerCase().includes(q);
          const matchId = c.id?.toLowerCase().includes(q);
          const matchComplaint = c.chiefComplaint?.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchComplaint) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.submittedDate).getTime();
        const dateB = new Date(b.submittedDate).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [cases, activeTab, statusFilter, searchQuery, sortOrder]);

  const pendingCount = useMemo(() => {
    return cases.filter((c) => c.status === 'pending' || c.status === 'flagged').length;
  }, [cases]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      {/* Institutional Top Navbar */}
      <header className="bg-white border-b-2 border-[#D9770E] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[8px] bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-center text-[#D9770E] font-semibold text-xl">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
                    <circle cx="12" cy="12" r="9" strokeWidth={1.5} className="text-[#0F6B4C]" stroke="currentColor" />
                  </svg>
                </div>
                <div>
                  <span className="font-heading text-xl font-semibold tracking-tight text-[#1A1A1A]">
                    MediConnect
                  </span>
                  <span className="ml-2 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-[#E8F5EE] text-[#0F6B4C] border border-[#B7E1CD]">
                    Doctor Admin
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-[14px] font-semibold text-[#1A1A1A]">
                  Dr. Rajesh Varma, BAMS, MD (Ayu)
                </div>
                <div className="text-[12px] text-[#0F6B4C] flex items-center justify-end gap-1 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Practitioner (NCISM-AYU-5491)
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3.5 py-2 text-[13px] font-medium rounded-[8px] border border-[#E8E2D9] bg-white hover:bg-[#FAF7F2] text-[#555555] hover:text-[#1A1A1A] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout with Left Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6 items-start">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 card p-2 bg-white border border-[#E8E2D9] rounded-[8px]">
          <div className="px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-[#8C827A] border-b border-[#E8E2D9] mb-1">
            Clinical Intake Admin
          </div>

          <nav className="space-y-1 mt-1">
            {/* Tab 1: Pending Cases */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('pending');
                setStatusFilter('all');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[6px] text-[14px] font-medium transition-colors text-left ${
                activeTab === 'pending'
                  ? 'bg-[#FAF7F2] text-[#D9770E] font-semibold border-l-4 border-[#D9770E]'
                  : 'text-[#555555] hover:bg-[#FAF7F2] hover:text-[#1A1A1A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" d="M12 7v5l3 2" />
                </svg>
                <span>Pending Cases</span>
              </div>
              <span
                className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                  activeTab === 'pending'
                    ? 'bg-[#FEF3C7] text-[#92400E]'
                    : 'bg-[#F3EFEA] text-[#555555]'
                }`}
              >
                {pendingCount}
              </span>
            </button>

            {/* Tab 2: Case History */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('history');
                setStatusFilter('all');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[6px] text-[14px] font-medium transition-colors text-left ${
                activeTab === 'history'
                  ? 'bg-[#FAF7F2] text-[#D9770E] font-semibold border-l-4 border-[#D9770E]'
                  : 'text-[#555555] hover:bg-[#FAF7F2] hover:text-[#1A1A1A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Case History</span>
              </div>
              <span className="text-[12px] text-[#8C827A]">
                {cases.filter((c) => c.status === 'reviewed').length}
              </span>
            </button>

            {/* Tab 3: Verified Patients */}
            <button
              type="button"
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[6px] text-[14px] font-medium transition-colors text-left ${
                activeTab === 'patients'
                  ? 'bg-[#FAF7F2] text-[#D9770E] font-semibold border-l-4 border-[#D9770E]'
                  : 'text-[#555555] hover:bg-[#FAF7F2] hover:text-[#1A1A1A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Verified Patients</span>
              </div>
            </button>

            {/* Tab 4: Settings */}
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[6px] text-[14px] font-medium transition-colors text-left ${
                activeTab === 'settings'
                  ? 'bg-[#FAF7F2] text-[#D9770E] font-semibold border-l-4 border-[#D9770E]'
                  : 'text-[#555555] hover:bg-[#FAF7F2] hover:text-[#1A1A1A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Practitioner Settings</span>
              </div>
            </button>
          </nav>

          <div className="mt-8 p-3 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[6px] text-[12px] text-[#555555]">
            <p className="font-semibold text-[#1A1A1A] mb-1">Clinical Protocol</p>
            <p>Every intake response is pre-triaged according to CCIM Ayurvedic anamnesis guidelines.</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          {/* View 1 & 2: Pending Cases or Case History Table */}
          {(activeTab === 'pending' || activeTab === 'history') && (
            <div className="space-y-4">
              {/* Top Filter & Search Bar */}
              <div className="card p-4 bg-white border border-[#E8E2D9] rounded-[8px]">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Search by Patient Name */}
                  <div className="sm:col-span-6 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search patient name, complaint, or case ID..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8E2D9] rounded-[8px] text-[14px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    />
                    <svg
                      className="w-4 h-4 text-[#8C827A] absolute left-3 top-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Filter by Status */}
                  <div className="sm:col-span-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-[8px] text-[14px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending Review</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="flagged">Flagged / Urgent</option>
                    </select>
                  </div>

                  {/* Filter by Date */}
                  <div className="sm:col-span-3">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-[8px] text-[14px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="card bg-white border border-[#E8E2D9] rounded-[8px] overflow-hidden shadow-none">
                <div className="px-5 py-4 border-b border-[#E8E2D9] flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-[20px] font-semibold text-[#1A1A1A]">
                      {activeTab === 'pending' ? 'Pending Intake Queue' : 'Reviewed Case History'}
                    </h2>
                    <p className="text-[13px] text-[#555555]">
                      Click any patient row to open the complete multi-section case file.
                    </p>
                  </div>
                  <span className="text-[13px] text-[#555555]">
                    Showing <strong className="tabular-nums text-[#1A1A1A]">{filteredCases.length}</strong> cases
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[14px]">
                    <thead>
                      <tr className="bg-[#FAF7F2] border-b border-[#E8E2D9] text-[#555555] text-[13px] font-medium">
                        <th className="py-3 px-4">Case ID</th>
                        <th className="py-3 px-4">Patient Name</th>
                        <th className="py-3 px-4">Age / Sex</th>
                        <th className="py-3 px-4">Chief Complaint</th>
                        <th className="py-3 px-4">Intake Date</th>
                        <th className="py-3 px-4">Severity</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D9]">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#555555]">
                            Loading patient case queue...
                          </td>
                        </tr>
                      ) : filteredCases.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-[#555555]">
                            No matching cases found for the selected filter.
                          </td>
                        </tr>
                      ) : (
                        filteredCases.map((c) => (
                          <tr
                            key={c.id}
                            onClick={() => setSelectedCase(c)}
                            className="cursor-pointer hover:bg-[#FAF7F2] transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-medium text-[13px] text-[#D9770E] tabular-nums">
                              {c.id}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">
                              {c.patientName}
                            </td>
                            <td className="py-3.5 px-4 text-[#555555] tabular-nums">
                              {c.age} yrs / {c.gender}
                            </td>
                            <td className="py-3.5 px-4 max-w-xs truncate text-[#1A1A1A]" title={c.chiefComplaint}>
                              {c.chiefComplaint}
                            </td>
                            <td className="py-3.5 px-4 text-[#555555] tabular-nums whitespace-nowrap">
                              {c.submittedDate}
                            </td>
                            <td className="py-3.5 px-4 capitalize">
                              <span
                                className={`text-[12px] font-medium px-2 py-0.5 rounded ${
                                  c.severity === 'severe'
                                    ? 'bg-[#FDEDEC] text-[#C0392B]'
                                    : c.severity === 'moderate'
                                    ? 'bg-[#FEF3C7] text-[#92400E]'
                                    : 'bg-[#FAF7F2] text-[#555555]'
                                }`}
                              >
                                {c.severity}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <StatusChip status={c.status} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* View 3: Verified Patients */}
          {activeTab === 'patients' && (
            <div className="card p-6 bg-white border border-[#E8E2D9] rounded-[8px]">
              <h2 className="font-heading text-[20px] font-semibold text-[#1A1A1A] mb-2">
                Verified Patient Directory
              </h2>
              <p className="text-[14px] text-[#555555] mb-6">
                Active registered patients within your assigned AYUSH clinical catchment district.
              </p>

              <div className="divide-y divide-[#E8E2D9]">
                {cases.map((c) => (
                  <div key={c.id} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[15px] text-[#1A1A1A]">{c.patientName}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#E8F5EE] text-[#0F6B4C] px-2 py-0.5 rounded-full border border-[#B7E1CD]">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                          </svg>
                          Identity Verified
                        </span>
                      </div>
                      <p className="text-[13px] text-[#555555] mt-0.5">
                        {c.city} · Age: <span className="tabular-nums">{c.age}</span> · Case Reference: <span className="font-mono tabular-nums">{c.id}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCase(c)}
                      className="px-3 py-1.5 text-[13px] font-medium text-[#0F6B4C] border border-[#0F6B4C] rounded-[8px] hover:bg-[#E8F5EE] transition-colors"
                    >
                      View Patient File
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View 4: Settings */}
          {activeTab === 'settings' && (
            <div className="card p-6 bg-white border border-[#E8E2D9] rounded-[8px]">
              <h2 className="font-heading text-[20px] font-semibold text-[#1A1A1A] mb-2">
                Practitioner Credentials & Clinic Profile
              </h2>
              <p className="text-[14px] text-[#555555] mb-6">
                Institutional accreditation verified by the National Commission for Indian System of Medicine.
              </p>

              <div className="space-y-4 max-w-xl text-[14px]">
                <div>
                  <label className="block text-[13px] text-[#555555]">Doctor Full Name</label>
                  <input
                    type="text"
                    disabled
                    value="Dr. Rajesh Varma"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#555555]">NCISM Registration Number</label>
                  <input
                    type="text"
                    disabled
                    value="NCISM-AYU-5491 / Rajasthan State Council"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#555555]">Affiliated Primary Clinic</label>
                  <input
                    type="text"
                    disabled
                    value="Government Ayurvedic Hospital & Triage Center, Jaipur"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px]"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Case Detail Drawer / Slide-Out Panel */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#E8E2D9] animate-in slide-in-from-right duration-200">
            {/* Drawer Top Header with Actions */}
            <div className="p-5 border-b border-[#E8E2D9] bg-[#FAF7F2] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[14px] font-bold text-[#D9770E] tabular-nums">
                    {selectedCase.id}
                  </span>
                  <StatusChip status={selectedCase.status} />
                </div>
                <h3 className="font-heading text-[20px] font-semibold text-[#1A1A1A] mt-1">
                  {selectedCase.patientName}
                </h3>
                <p className="text-[13px] text-[#555555]">
                  Age: <span className="tabular-nums">{selectedCase.age}</span> yrs · {selectedCase.gender} · {selectedCase.city}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="w-9 h-9 rounded-full border border-[#E8E2D9] bg-white flex items-center justify-center text-[#555555] hover:text-[#1A1A1A]"
              >
                ✕
              </button>
            </div>

            {/* Action Bar: Green "Mark Reviewed" Primary, Red-Outlined "Flag Case" Secondary */}
            <div className="p-4 bg-white border-b border-[#E8E2D9] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Green Mark Reviewed Button */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedCase.id, 'review')}
                  disabled={actionProcessing !== null || selectedCase.status === 'reviewed'}
                  className="px-5 min-h-[44px] rounded-[8px] bg-[#0F6B4C] text-white font-medium text-[14px] hover:bg-[#0a4f38] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{selectedCase.status === 'reviewed' ? 'Reviewed' : 'Mark Reviewed'}</span>
                </button>

                {/* Red-Outlined Flag Case Button (Never solid red) */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedCase.id, 'flag')}
                  disabled={actionProcessing !== null || selectedCase.status === 'flagged'}
                  className="btn-destructive text-[14px]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{selectedCase.status === 'flagged' ? 'Flagged Urgent' : 'Flag Case'}</span>
                </button>
              </div>

              <div className="text-[13px] text-[#555555] tabular-nums">
                Submitted: {selectedCase.submittedDate}
              </div>
            </div>

            {/* Scrollable Patient Responses Labeled by Form Sections */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Chief Complaint & Duration */}
              <div className="card p-5 bg-white border border-[#E8E2D9] rounded-[8px]">
                <h4 className="font-heading text-[16px] font-semibold text-[#1A1A1A] pb-2 border-b border-[#E8E2D9] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D9770E]" />
                  1. Chief Complaint (Pradhana Vedana)
                </h4>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#555555] font-medium">Primary Symptom:</strong> {selectedCase.details?.chiefComplaint || selectedCase.chiefComplaint}</p>
                  <p><strong className="text-[#555555] font-medium">Duration:</strong> {selectedCase.details?.duration || selectedCase.duration}</p>
                  <p><strong className="text-[#555555] font-medium">Severity:</strong> <span className="capitalize">{selectedCase.details?.severity || selectedCase.severity}</span> ({selectedCase.details?.onset || 'Gradual'})</p>
                  {selectedCase.details?.aggravatingFactors && (
                    <p><strong className="text-[#555555] font-medium">Aggravating Factors:</strong> {selectedCase.details.aggravatingFactors}</p>
                  )}
                </div>
              </div>

              {/* Section 2: Digestive & Metabolic Assessment */}
              <div className="card p-5 bg-white border border-[#E8E2D9] rounded-[8px]">
                <h4 className="font-heading text-[16px] font-semibold text-[#1A1A1A] pb-2 border-b border-[#E8E2D9] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0F6B4C]" />
                  2. Digestive & Metabolic Assessment (Agni & Koshta)
                </h4>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#555555] font-medium">Appetite (Agni):</strong> {selectedCase.details?.appetite || 'Samagni (Balanced)'}</p>
                  <p><strong className="text-[#555555] font-medium">Bowel Habits (Koshta):</strong> {selectedCase.details?.bowelHabits || 'Madhyama'}</p>
                  <p><strong className="text-[#555555] font-medium">Post-Meal Sensation:</strong> {selectedCase.details?.postMealSensation || 'Normal'}</p>
                  <p><strong className="text-[#555555] font-medium">Thirst Pattern:</strong> {selectedCase.details?.thirstPattern || 'Normal'}</p>
                </div>
              </div>

              {/* Section 3: Lifestyle & Sleep */}
              <div className="card p-5 bg-white border border-[#E8E2D9] rounded-[8px]">
                <h4 className="font-heading text-[16px] font-semibold text-[#1A1A1A] pb-2 border-b border-[#E8E2D9] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D9770E]" />
                  3. Lifestyle & Sleep Rhythm (Vihara & Nidra)
                </h4>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#555555] font-medium">Sleep Quality (Nidra):</strong> {selectedCase.details?.sleepQuality || 'Sound 7 hours'}</p>
                  <p><strong className="text-[#555555] font-medium">Physical Exertion (Vyayama):</strong> {selectedCase.details?.physicalActivity || 'Moderate'}</p>
                  <p><strong className="text-[#555555] font-medium">Mental Strain (Manasika):</strong> {selectedCase.details?.stressLevel || 'Moderate'}</p>
                  <p><strong className="text-[#555555] font-medium">Dietary Habit:</strong> {selectedCase.details?.dietPreference || 'Vegetarian'}</p>
                </div>
              </div>

              {/* Section 4: Ayurvedic Constitutional Indicators */}
              <div className="card p-5 bg-white border border-[#E8E2D9] rounded-[8px]">
                <h4 className="font-heading text-[16px] font-semibold text-[#1A1A1A] pb-2 border-b border-[#E8E2D9] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0F6B4C]" />
                  4. Constitutional Indicators (Dosha Screen)
                </h4>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#555555] font-medium">Climate / Thermal Sensitivity:</strong> {selectedCase.details?.thermalPreference || 'Tolerant to both'}</p>
                  <p><strong className="text-[#555555] font-medium">Skin Texture (Sparshana):</strong> {selectedCase.details?.skinType || 'Normal'}</p>
                  <p><strong className="text-[#555555] font-medium">Energy Fluctuation (Bala):</strong> {selectedCase.details?.energyPattern || 'Steady'}</p>
                </div>
              </div>

              {/* Section 5: Medical History & Prescriptions */}
              <div className="card p-5 bg-white border border-[#E8E2D9] rounded-[8px]">
                <h4 className="font-heading text-[16px] font-semibold text-[#1A1A1A] pb-2 border-b border-[#E8E2D9] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D9770E]" />
                  5. Medical History & Current Prescriptions
                </h4>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#555555] font-medium">Chronic Diagnoses:</strong> {selectedCase.details?.chronicConditions || 'None reported'}</p>
                  <p><strong className="text-[#555555] font-medium">Active Medications:</strong> {selectedCase.details?.currentMedications || 'None'}</p>
                  <p><strong className="text-[#555555] font-medium">Allergies:</strong> {selectedCase.details?.allergies || 'None declared'}</p>
                  {selectedCase.details?.notes && (
                    <p><strong className="text-[#555555] font-medium">Doctor Clinical Notes:</strong> {selectedCase.details.notes}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E8E2D9] bg-[#FAF7F2] text-right">
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="px-5 py-2.5 rounded-[8px] border border-[#E8E2D9] bg-white text-[14px] font-medium text-[#1A1A1A] hover:bg-[#FAF7F2]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
