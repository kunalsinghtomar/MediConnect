import React from 'react';

export type StatusType = 'pending' | 'completed' | 'verified' | 'flagged' | 'urgent';

interface StatusChipProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label, className = '' }) => {
  const normalized = status?.toLowerCase();

  if (normalized === 'pending' || normalized === 'pending review') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] ${className}`}>
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 7v5l3 2" />
        </svg>
        <span>{label || 'Pending Review'}</span>
      </span>
    );
  }

  if (normalized === 'completed' || normalized === 'verified' || normalized === 'reviewed') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#E8F5EE] text-[#0F6B4C] border border-[#B7E1CD] ${className}`}>
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>{label || (normalized === 'verified' ? 'Verified Doctor' : 'Completed')}</span>
      </span>
    );
  }

  if (normalized === 'flagged' || normalized === 'urgent' || normalized === 'rejected') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#FDEDEC] text-[#C0392B] border border-[#F5B7B1] ${className}`}>
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <span>{label || (normalized === 'urgent' ? 'Urgent' : 'Flagged')}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#F3EFEA] text-[#555555] border border-[#E8E2D9] ${className}`}>
      <span className="w-2 h-2 rounded-full bg-[#9E988F]" />
      <span>{label || status}</span>
    </span>
  );
};
