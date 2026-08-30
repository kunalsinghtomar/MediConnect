'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// This is the patient registration page.
// It is the form that appears after the user chooses "I am a patient".
// Very simple idea: here we collect basic patient details and save them in the database.

interface FormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  city: string;
  preferredLanguage: string;
}

export default function PatientRegistration() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    city: '',
    preferredLanguage: 'English',
  });

  // If user is not logged in, redirect to home
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-blue-950">Loading...</div>;
  }

  // This function updates the form every time the user types or selects an option.
  // Example: when they type their name, the name field in the state also updates.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // This function sends the patient form data to the backend API.
  // The backend then saves the data and updates the user's role to patient.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send patient registration data to the backend
      const response = await fetch('/api/patient/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration successful, redirect to patient dashboard
        router.push('/patient/dashboard');
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      alert('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.85),_transparent_30%),linear-gradient(135deg,_#eff6ff_0%,_#eef2ff_22%,_#f8fbff_100%)] py-12 text-slate-800">
      <nav className="mb-12 border-b border-sky-100 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-200 text-xl text-white">✚</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">MediConnect</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto rounded-[2rem] border border-sky-100 bg-white/80 p-8 shadow-[0_24px_80px_rgba(14,116,144,0.08)] backdrop-blur-sm">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Patient</p>
          <h2 className="mt-4 text-3xl font-black text-sky-950">
            Patient Registration
          </h2>
          <p className="mt-2 text-sky-900/80">
            Tell us a bit about yourself so we can help you better
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-sky-950">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none ring-0 transition focus:border-sky-400 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="mb-1 block text-sm font-medium text-sky-950">
              Date of Birth *
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="gender" className="mb-1 block text-sm font-medium text-sky-950">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-sky-950">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="10-digit phone number"
              required
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium text-sky-950">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Your city"
              required
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="preferredLanguage" className="mb-1 block text-sm font-medium text-sky-950">
              Preferred Language *
            </label>
            <select
              id="preferredLanguage"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Kannada">Kannada</option>
              <option value="Bengali">Bengali</option>
              <option value="Gujarati">Gujarati</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </div>

          <p className="text-center text-sm text-sky-900/80">
            * All fields are required
          </p>
        </form>
      </div>
    </div>
  );
}
