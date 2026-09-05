'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b-2 border-[#D9770E] sticky top-0 z-30 shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & National/AYUSH Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[8px] bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-center text-[#D9770E] font-semibold text-xl shadow-none group-hover:border-[#D9770E] transition-colors">
              <svg className="w-6 h-6 text-[#D9770E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
                <circle cx="12" cy="12" r="9" strokeWidth={1.5} className="text-[#0F6B4C]" stroke="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl font-semibold tracking-tight text-[#1A1A1A]">
                  MediConnect
                </span>
                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#FAF7F2] text-[#0F6B4C] border border-[#E8E2D9]">
                  AYUSH
                </span>
              </div>
              <p className="text-[12px] text-[#555555] leading-none hidden sm:block">
                National Pre-Consultation Case-Taking Portal
              </p>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[#555555]">
              <Link href="/patient/case-taking" className="hover:text-[#D9770E] transition-colors">
                Patient Case-Taking
              </Link>
              <Link href="/doctor/dashboard" className="hover:text-[#D9770E] transition-colors">
                Doctor Admin Panel
              </Link>
              <span className="text-[#E8E2D9]">|</span>
              <span className="text-[13px] text-[#0F6B4C] font-medium flex items-center gap-1.5 bg-[#E8F5EE] px-2.5 py-1 rounded-full border border-[#B7E1CD]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                MoA Verified
              </span>
            </div>

            {session?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[#1A1A1A] font-medium hidden sm:inline">
                  {session.user.name || 'Account'}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-[14px] font-medium rounded-[8px] border border-[#E8E2D9] text-[#1A1A1A] hover:bg-[#FAF7F2] transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/role-selection"
                className="px-4 py-2 text-[14px] font-medium rounded-[8px] bg-[#FAF7F2] text-[#0F6B4C] border border-[#0F6B4C] hover:bg-[#E8F5EE] transition-colors"
              >
                Register
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
