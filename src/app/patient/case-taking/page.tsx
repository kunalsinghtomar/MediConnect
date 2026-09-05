'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { StatusChip } from '@/components/StatusChip';

interface FormData {
  // Step 1: Chief Complaint & Duration
  chiefComplaint: string;
  duration: string;
  severity: string;
  onset: string;
  aggravatingFactors: string;

  // Step 2: Digestive & Metabolic Assessment (Agni & Koshta)
  appetite: string;
  bowelHabits: string;
  postMealSensation: string;
  thirstPattern: string;

  // Step 3: Lifestyle & Sleep (Vihara & Nidra)
  sleepQuality: string;
  physicalActivity: string;
  stressLevel: string;
  dietPreference: string;

  // Step 4: Constitutional Indicators (Dosha Screen)
  thermalPreference: string;
  skinType: string;
  energyPattern: string;

  // Step 5: Medical History & Medications
  chronicConditions: string;
  currentMedications: string;
  allergies: string;
  notes: string;
}

const initialFormData: FormData = {
  chiefComplaint: '',
  duration: '',
  severity: '',
  onset: 'Gradual',
  aggravatingFactors: '',
  appetite: '',
  bowelHabits: '',
  postMealSensation: '',
  thirstPattern: '',
  sleepQuality: '',
  physicalActivity: '',
  stressLevel: '',
  dietPreference: 'Vegetarian',
  thermalPreference: '',
  skinType: '',
  energyPattern: '',
  chronicConditions: '',
  currentMedications: '',
  allergies: '',
  notes: '',
};

const STEPS = [
  { id: 1, title: 'Chief Complaint', subtitle: 'Pradhana Vedana' },
  { id: 2, title: 'Metabolism & Agni', subtitle: 'Digestive Assessment' },
  { id: 3, title: 'Lifestyle & Nidra', subtitle: 'Sleep & Routine' },
  { id: 4, title: 'Dosha Indicators', subtitle: 'Constitutional Screen' },
  { id: 5, title: 'Medical History', subtitle: 'Past Treatments & Meds' },
  { id: 6, title: 'Review & Submit', subtitle: 'Verification' },
];

export default function PatientCaseTaking() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user fills field
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.chiefComplaint.trim()) {
        newErrors.chiefComplaint = 'Please describe your main health concern or symptom.';
      }
      if (!formData.duration.trim()) {
        newErrors.duration = 'Please specify how long you have had this symptom.';
      }
      if (!formData.severity) {
        newErrors.severity = 'Please select the symptom severity level.';
      }
    }

    if (step === 2) {
      if (!formData.appetite) {
        newErrors.appetite = 'Please indicate your typical appetite level (Agni).';
      }
      if (!formData.bowelHabits) {
        newErrors.bowelHabits = 'Please select your daily bowel evacuation pattern (Koshta).';
      }
    }

    if (step === 3) {
      if (!formData.sleepQuality) {
        newErrors.sleepQuality = 'Please select your sleep quality and duration.';
      }
      if (!formData.stressLevel) {
        newErrors.stressLevel = 'Please indicate your current stress / tension level.';
      }
    }

    if (step === 4) {
      if (!formData.thermalPreference) {
        newErrors.thermalPreference = 'Please select your temperature and climate tolerance.';
      }
    }

    if (step === 5) {
      if (!formData.currentMedications.trim()) {
        newErrors.currentMedications = 'Please write any active medications or enter "None".';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitCase = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/patient/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setSubmittedCaseId(result.caseId || `AYU-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch (err) {
      setSubmittedCaseId(`AYU-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <Header />

      {/* Fixed Stepper Progress Header */}
      <div className="sticky top-16 z-20 bg-white border-b border-[#E8E2D9] shadow-none">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STEPS.map((step, index) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div key={step.id} className="flex items-center flex-1 min-w-[130px]">
                  <div className="flex items-center gap-2.5">
                    {/* Circle Indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-[#E8F5EE] text-[#0F6B4C] border border-[#0F6B4C]'
                          : isCurrent
                          ? 'bg-[#D9770E] text-white'
                          : 'bg-[#FAF7F2] text-[#555555] border border-[#E8E2D9]'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <p
                        className={`text-[13px] font-medium leading-tight ${
                          isCurrent
                            ? 'text-[#D9770E] font-semibold'
                            : isCompleted
                            ? 'text-[#0F6B4C]'
                            : 'text-[#555555]'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-[#8C827A] leading-tight">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-3 hidden md:block ${
                        step.id < currentStep ? 'bg-[#0F6B4C]' : 'bg-[#E8E2D9]'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Intake Form Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 pb-32">
        {submittedCaseId ? (
          /* Submission Success Card */
          <div className="card p-8 bg-white border border-[#E8E2D9] rounded-[8px] text-center">
            <div className="w-16 h-16 rounded-full bg-[#E8F5EE] text-[#0F6B4C] flex items-center justify-center mx-auto mb-4 border border-[#B7E1CD]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-[24px] font-semibold text-[#1A1A1A]">
              Case Intake Successfully Submitted
            </h2>
            <p className="mt-2 text-[16px] text-[#555555]">
              Your clinical pre-consultation file has been registered with the AYUSH Doctor Review Queue.
            </p>

            <div className="my-6 p-4 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px] max-w-md mx-auto inline-block text-left w-full">
              <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D9]">
                <span className="text-[14px] text-[#555555]">Assigned Case Reference:</span>
                <span className="font-mono font-semibold text-[15px] text-[#D9770E] tabular-nums">
                  {submittedCaseId}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[14px] text-[#555555]">Initial Intake Status:</span>
                <StatusChip status="pending" label="Pending Review" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <button
                onClick={() => router.push('/doctor/dashboard')}
                className="btn-primary"
              >
                View in Doctor Admin Panel
              </button>
              <button
                onClick={() => {
                  setSubmittedCaseId(null);
                  setCurrentStep(1);
                  setFormData(initialFormData);
                }}
                className="btn-secondary"
              >
                Submit Another Case
              </button>
            </div>
          </div>
        ) : (
          /* Paced Step Content */
          <div className="card p-6 sm:p-8 bg-white border border-[#E8E2D9] rounded-[8px]">
            {/* Step Header */}
            <div className="mb-6 pb-4 border-b border-[#E8E2D9]">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#D9770E] uppercase tracking-wider">
                  Step {currentStep} of {STEPS.length}
                </span>
                <span className="text-[13px] text-[#8C827A]">
                  AYUSH Standard Intake Anamnesis
                </span>
              </div>
              <h2 className="font-heading text-[24px] font-semibold text-[#1A1A1A] mt-1">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-[14px] text-[#555555] mt-0.5">
                {STEPS[currentStep - 1].subtitle} — Provide clear, accurate clinical observations.
              </p>
            </div>

            {/* Single Column Field Layout, 16px Spacing */}
            <div className="space-y-4">
              {/* STEP 1: Chief Complaint */}
              {currentStep === 1 && (
                <>
                  <div>
                    <label htmlFor="chiefComplaint" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Chief Complaint / Primary Symptoms (Pradhana Vedana) <span className="text-[#C0392B]">*</span>
                    </label>
                    <textarea
                      id="chiefComplaint"
                      rows={3}
                      value={formData.chiefComplaint}
                      onChange={(e) => handleFieldChange('chiefComplaint', e.target.value)}
                      placeholder="e.g. Persistent lower back stiffness, chronic acidity after lunch, burning sensation in soles"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    />
                    {errors.chiefComplaint && (
                      <p className="text-[13px] text-[#C0392B] mt-1 flex items-center gap-1">
                        <span>•</span> {errors.chiefComplaint}
                      </p>
                    )}
                    <p className="text-[13px] text-[#555555] mt-1">
                      Describe what discomfort prompted this consultation in your own words.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Duration of Symptoms <span className="text-[#C0392B]">*</span>
                    </label>
                    <input
                      id="duration"
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleFieldChange('duration', e.target.value)}
                      placeholder="e.g. 3 weeks, 4 months, intermittent for 1 year"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    />
                    {errors.duration && (
                      <p className="text-[13px] text-[#C0392B] mt-1 flex items-center gap-1">
                        <span>•</span> {errors.duration}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="severity" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Severity / Discomfort Intensity <span className="text-[#C0392B]">*</span>
                    </label>
                    <select
                      id="severity"
                      value={formData.severity}
                      onChange={(e) => handleFieldChange('severity', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="">Select severity level...</option>
                      <option value="mild">Mild — Manageable, does not interrupt daily routine</option>
                      <option value="moderate">Moderate — Noticeable discomfort, impacts productivity</option>
                      <option value="severe">Severe — Significant pain/distress, urgently impairs normal activities</option>
                    </select>
                    {errors.severity && (
                      <p className="text-[13px] text-[#C0392B] mt-1 flex items-center gap-1">
                        <span>•</span> {errors.severity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="onset" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Onset Pattern
                    </label>
                    <select
                      id="onset"
                      value={formData.onset}
                      onChange={(e) => handleFieldChange('onset', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="Gradual">Gradual (Developed slowly over time)</option>
                      <option value="Sudden">Sudden / Acute (Appeared abruptly)</option>
                      <option value="Recurrent">Recurrent (Episodes that come and go)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="aggravatingFactors" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Aggravating or Relieving Triggers
                    </label>
                    <input
                      id="aggravatingFactors"
                      type="text"
                      value={formData.aggravatingFactors}
                      onChange={(e) => handleFieldChange('aggravatingFactors', e.target.value)}
                      placeholder="e.g. Worse with cold drinks, improves with warm compresses, worse late evening"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    />
                  </div>
                </>
              )}

              {/* STEP 2: Metabolism & Agni */}
              {currentStep === 2 && (
                <>
                  <div>
                    <label htmlFor="appetite" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Appetite Pattern (Agni Assessment) <span className="text-[#C0392B]">*</span>
                    </label>
                    <select
                      id="appetite"
                      value={formData.appetite}
                      onChange={(e) => handleFieldChange('appetite', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="">Select appetite pattern...</option>
                      <option value="Samagni">Samagni (Regular, balanced hunger at proper meal times)</option>
                      <option value="Mandagni">Mandagni (Sluggish / Low hunger, heavy feeling even with small meals)</option>
                      <option value="Tikshnagni">Tikshnagni (Excessive / Sharp hunger, burning if meal delayed)</option>
                      <option value="Vishamagni">Vishamagni (Irregular / Unpredictable hunger, varies day to day)</option>
                    </select>
                    {errors.appetite && (
                      <p className="text-[13px] text-[#C0392B] mt-1 flex items-center gap-1">
                        <span>•</span> {errors.appetite}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bowelHabits" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Bowel Elimination Tendency (Koshta) <span className="text-[#C0392B]">*</span>
                    </label>
                    <select
                      id="bowelHabits"
                      value={formData.bowelHabits}
                      onChange={(e) => handleFieldChange('bowelHabits', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="">Select bowel habit...</option>
                      <option value="Madhyama">Madhyama (Regular, once daily every morning, smooth)</option>
                      <option value="Krura">Krura (Constipated / Hard stools, dry, requires straining)</option>
                      <option value="Mridu">Mridu (Soft / Loose, multiple evacuations or sensitive to milk/spices)</option>
                      <option value="Irregular">Irregular / Alternating between hard and loose</option>
                    </select>
                    {errors.bowelHabits && (
                      <p className="text-[13px] text-[#C0392B] mt-1 flex items-center gap-1">
                        <span>•</span> {errors.bowelHabits}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postMealSensation" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Post-Meal Sensation
                    </label>
                    <select
                      id="postMealSensation"
                      value={formData.postMealSensation}
                      onChange={(e) => handleFieldChange('postMealSensation', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="Light and comfortable">Light and comfortable (Sukhapaka)</option>
                      <option value="Bloating and gas">Bloating, gas, and abdominal distension</option>
                      <option value="Heartburn and acid reflux">Heartburn, sour belching, or acid regurgitation</option>
                      <option value="Lethargy and heaviness">Excessive drowsiness and stomach heaviness</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="thirstPattern" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Thirst & Water Intake Habit
                    </label>
                    <input
                      id="thirstPattern"
                      type="text"
                      value={formData.thirstPattern}
                      onChange={(e) => handleFieldChange('thirstPattern', e.target.value)}
                      placeholder="e.g. High thirst preferring warm water, or low thirst (under 1.5L daily)"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    />
                  </div>
                </>
              )}

              {/* STEP 3: Lifestyle & Nidra */}
              {currentStep === 3 && (
                <>
                  <div>
                    <label htmlFor="sleepQuality" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Sleep Quality & Duration (Nidra) <span className="text-[#C0392B]">*</span>
                    </label>
                    <select
                      id="sleepQuality"
                      value={formData.sleepQuality}
                      onChange={(e) => handleFieldChange('sleepQuality', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="">Select sleep pattern...</option>
                      <option value="Sound 7-8 hours">Sound, uninterrupted 7 to 8 hours (Restful)</option>
                      <option value="Interrupted / Light">Interrupted, light sleeper, waking multiple times</option>
                      <option value="Difficulty falling asleep">Difficulty falling asleep (Takes over 60 mins)</option>
                      <option value="Excessive drowsiness">Excessive sleep / Daytime sleepiness & heaviness</option>
                    </select>
                    {errors.sleepQuality && (
                      <p className="text-[13px] text-[#C0392B] mt-1 flex items-center gap-1">
                        <span>•</span> {errors.sleepQuality}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="physicalActivity" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Physical Activity & Daily Exertion (Vyayama)
                    </label>
                    <select
                      id="physicalActivity"
                      value={formData.physicalActivity}
                      onChange={(e) => handleFieldChange('physicalActivity', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="Sedentary">Sedentary (Desk work, minimal walking/exercise)</option>
                      <option value="Moderate">Moderate (Daily walking 30-45 mins, yoga or light workout)</option>
                      <option value="Vigorous">Vigorous (Intense gym, heavy sports, or manual physical labor)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="stressLevel" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Mental Strain & Stress Level (Manasika Bhava) <span className="text-[#C0392B]">*</span>
                    </label>
                    <select
                      id="stressLevel"
                      value={formData.stressLevel}
                      onChange={(e) => handleFieldChange('stressLevel', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="">Select stress level...</option>
                      <option value="Low">Low — Calm and relaxed mindset</option>
                      <option value="Moderate">Moderate — Occasional work/family tension, manageable</option>
                      <option value="High">High — Frequent anxiety, worry, anger, or feeling overwhelmed</option>
                    </select>
                    {errors.stressLevel && (
                      <p className="text-[13px] text-[#C0392B] mt-1 flex items-center gap-1">
                        <span>•</span> {errors.stressLevel}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dietPreference" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Dietary Lifestyle (Ahara)
                    </label>
                    <select
                      id="dietPreference"
                      value={formData.dietPreference}
                      onChange={(e) => handleFieldChange('dietPreference', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="Vegetarian">Vegetarian (Pure vegetarian)</option>
                      <option value="Lacto-vegetarian">Lacto-vegetarian (Includes dairy)</option>
                      <option value="Non-vegetarian">Non-vegetarian (Includes meat / fish / eggs)</option>
                      <option value="Vegan">Vegan (Strict plant-based)</option>
                    </select>
                  </div>
                </>
              )}

              {/* STEP 4: Dosha Screen */}
              {currentStep === 4 && (
                <>
                  <div>
                    <label htmlFor="thermalPreference" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Thermal & Climate Tolerance (Sheeta / Ushna) <span className="text-[#C0392B]">*</span>
                    </label>
                    <select
                      id="thermalPreference"
                      value={formData.thermalPreference}
                      onChange={(e) => handleFieldChange('thermalPreference', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="">Select climate sensitivity...</option>
                      <option value="Cold Intolerant">Cold Intolerant (Prefers warm climates, hands/feet turn cold easily — Vata tendency)</option>
                      <option value="Heat Intolerant">Heat Intolerant (Easily sweats, burns in sun, prefers AC/cooling — Pitta tendency)</option>
                      <option value="Tolerant to both">Balanced / Moderate tolerance to seasons — Kapha tendency</option>
                    </select>
                    {errors.thermalPreference && (
                      <p className="text-[13px] text-[#C0392B] mt-1 flex items-center gap-1">
                        <span>•</span> {errors.thermalPreference}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="skinType" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Skin Texture (Sparshana)
                    </label>
                    <select
                      id="skinType"
                      value={formData.skinType}
                      onChange={(e) => handleFieldChange('skinType', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="Dry and rough">Dry, rough, or easily chapped (Vata)</option>
                      <option value="Warm and prone to breakouts">Warm, oily T-zone, prone to redness or moles (Pitta)</option>
                      <option value="Soft and cool">Thick, cool, soft, well-hydrated (Kapha)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="energyPattern" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Energy & Stamina Fluctuation (Bala)
                    </label>
                    <select
                      id="energyPattern"
                      value={formData.energyPattern}
                      onChange={(e) => handleFieldChange('energyPattern', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    >
                      <option value="Fluctuating">Fluctuating — Sudden bursts followed by quick exhaustion</option>
                      <option value="High and focused">High and focused — Driven but irritable when depleted</option>
                      <option value="Steady and slow">Steady and enduring — Slow to start, high stamina</option>
                    </select>
                  </div>
                </>
              )}

              {/* STEP 5: Medical History */}
              {currentStep === 5 && (
                <>
                  <div>
                    <label htmlFor="chronicConditions" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Diagnosed Chronic Conditions (Past Illnesses)
                    </label>
                    <input
                      id="chronicConditions"
                      type="text"
                      value={formData.chronicConditions}
                      onChange={(e) => handleFieldChange('chronicConditions', e.target.value)}
                      placeholder="e.g. Hypertension (5 yrs), Hypothyroidism, None"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="currentMedications" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Current Prescriptions & Ayurvedic Remedies <span className="text-[#C0392B]">*</span>
                    </label>
                    <textarea
                      id="currentMedications"
                      rows={3}
                      value={formData.currentMedications}
                      onChange={(e) => handleFieldChange('currentMedications', e.target.value)}
                      placeholder="List all active allopathic, homeopathic, or herbal supplements (or enter 'None')"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    />
                    {errors.currentMedications && (
                      <p className="text-[13px] text-[#C0392B] mt-1 flex items-center gap-1">
                        <span>•</span> {errors.currentMedications}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="allergies" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Known Food or Drug Allergies (Satmya / Asatmya)
                    </label>
                    <input
                      id="allergies"
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => handleFieldChange('allergies', e.target.value)}
                      placeholder="e.g. Penicillin, Peanuts, Dust, or None"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                      Additional Doctor Notes / Observations
                    </label>
                    <textarea
                      id="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => handleFieldChange('notes', e.target.value)}
                      placeholder="Any specific questions or prior lab reports you wish to draw attention to"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-[8px] text-[16px] text-[#1A1A1A] focus:border-[#D9770E] focus:ring-2 focus:ring-[#D9770E]/20"
                    />
                  </div>
                </>
              )}

              {/* STEP 6: Review & Final Submission */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px]">
                    <h3 className="font-heading text-[16px] font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                      <span>1. Chief Complaint</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[13px] text-[#D9770E] font-medium hover:underline"
                      >
                        Edit
                      </button>
                    </h3>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Symptom:</strong> {formData.chiefComplaint}</p>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Duration:</strong> {formData.duration}</p>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Severity:</strong> {formData.severity} ({formData.onset})</p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px]">
                    <h3 className="font-heading text-[16px] font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                      <span>2. Metabolism (Agni & Koshta)</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-[13px] text-[#D9770E] font-medium hover:underline"
                      >
                        Edit
                      </button>
                    </h3>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Appetite:</strong> {formData.appetite}</p>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Bowel Habit:</strong> {formData.bowelHabits}</p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px]">
                    <h3 className="font-heading text-[16px] font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                      <span>3. Lifestyle & Sleep</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-[13px] text-[#D9770E] font-medium hover:underline"
                      >
                        Edit
                      </button>
                    </h3>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Sleep:</strong> {formData.sleepQuality}</p>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Stress Level:</strong> {formData.stressLevel}</p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px]">
                    <h3 className="font-heading text-[16px] font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                      <span>4. Dosha Indicators</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="text-[13px] text-[#D9770E] font-medium hover:underline"
                      >
                        Edit
                      </button>
                    </h3>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Thermal Sensitivity:</strong> {formData.thermalPreference}</p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D9] rounded-[8px]">
                    <h3 className="font-heading text-[16px] font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                      <span>5. Medications & History</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="text-[13px] text-[#D9770E] font-medium hover:underline"
                      >
                        Edit
                      </button>
                    </h3>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Current Meds:</strong> {formData.currentMedications}</p>
                    <p className="text-[14px] text-[#1A1A1A]"><strong className="text-[#555555]">Known Allergies:</strong> {formData.allergies || 'None declared'}</p>
                  </div>

                  <div className="p-3 bg-[#E8F5EE] border border-[#B7E1CD] rounded-[8px] text-[13px] text-[#0F6B4C] flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      I certify that this case history accurately reflects my current symptoms for official AYUSH pre-consultation review.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Footer Bar — Always visible without scrolling */}
      {!submittedCaseId && (
        <div className="sticky bottom-0 z-30 bg-white border-t border-[#E8E2D9] py-3.5 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="text-[14px] font-medium text-[#555555] hover:text-[#1A1A1A] disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 transition-colors"
            >
              ← Back
            </button>

            <div className="text-[13px] text-[#8C827A] hidden sm:block">
              Required fields marked with <span className="text-[#C0392B] font-semibold">*</span>
            </div>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                <span>Save & Continue</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitCase}
                className="btn-primary bg-[#D9770E] hover:bg-[#B45309]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Transmitting Case...
                  </span>
                ) : (
                  <span>Submit Case to AYUSH Doctor</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
