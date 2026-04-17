"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

import { INITIAL_FORM_DATA, STEPS, STEP_SUBTITLES } from "./constants";
import { validateStep } from "./validation";
import { createRequest } from "../bookAction";

import {
  BookingFormData,
  BranchOption,
  ServiceOption,
  SlotOption,
  StepErrors,
} from "./types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface BookingFormProps {
  branches: BranchOption[];
  services: ServiceOption[];
  slots: SlotOption[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingForm({
  branches,
  services,
  slots,
}: BookingFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<StepErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ── update ──────────────────────────────────────────────────────────────────
  const update = useCallback((key: keyof BookingFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  // ── navigation ──────────────────────────────────────────────────────────────
  const goToStep = useCallback((step: number) => {
    setErrors({});
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    goToStep(currentStep + 1);
  }, [currentStep, formData, goToStep]);

  const handleBack = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  // ── submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setSubmitError("");
    setIsSubmitting(true);

    const result = await createRequest(formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmitError(result.error);
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting]);

  // ── success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen relative flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-teal-50 via-slate-50 to-indigo-100 overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 sm:w-200 h-150 sm:h-200 bg-linear-to-tr from-teal-300/30 via-blue-300/20 to-purple-300/30 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-md w-full text-center space-y-6 bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 border border-slate-100">
          <div className="mx-auto w-16 h-16 bg-linear-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Booking Submitted
          </h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Your request is pending review. Our team will contact you shortly to
            confirm pricing and scheduling.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-teal-500 to-purple-600 hover:opacity-90 active:scale-[0.98]
              rounded-xl text-sm text-white font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20 mt-4"
          >
            Go to Dashboard <span className="ml-1">→</span>
          </button>
        </div>
      </main>
    );
  }

  // ── form ────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen relative py-12 px-4 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-teal-100 overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Abstract background blurs */}
      <div className="fixed top-[-10%] right-[-5%] w-125 sm:w-200 h-125 sm:h-200 bg-teal-300/30 blur-[140px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-125 sm:w-200 h-125 sm:h-200 bg-indigo-300/30 blur-[140px] rounded-full -z-10 pointer-events-none" />

      <div
        className={`w-full ${currentStep === 4 ? "max-w-3xl lg:max-w-208" : "max-w-xl"} bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 border-2 border-teal-600 p-8 sm:p-10 relative z-10 transition-all duration-500`}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-teal-500 to-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-teal-500/20 mb-5 sm:mb-6 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 sm:w-10 sm:h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight mb-2 sm:mb-3">
            Book a Service
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-500 mb-6 sm:mb-8">
            {STEP_SUBTITLES[currentStep]}
          </p>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm lg:text-base font-semibold text-slate-500 mr-2 uppercase tracking-wide">
              Step {currentStep} of {STEPS.length}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i + 1 === currentStep
                      ? "w-6 bg-linear-to-r from-teal-500 to-blue-500"
                      : i + 1 < currentStep
                        ? "bg-teal-400 w-2"
                        : "w-2 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form area */}
        <div className="space-y-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentStep === 1 && (
              <StepOne data={formData} errors={errors} update={update} />
            )}
            {currentStep === 2 && (
              <StepTwo data={formData} errors={errors} update={update} />
            )}
            {currentStep === 3 && (
              <StepThree
                data={formData}
                errors={errors}
                update={update}
                branches={branches}
                services={services}
                slots={slots}
              />
            )}
            {currentStep === 4 && (
              <StepFour
                data={formData}
                branches={branches}
                services={services}
                slots={slots}
              />
            )}
          </div>

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                {submitError}
              </p>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="pt-6 mt-4 flex items-center justify-between gap-3 sm:gap-4 w-full">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-5 cursor-pointer sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-slate-200 rounded-2xl
                  text-sm sm:text-base font-bold text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50
                  transition-all duration-200 disabled:opacity-50 shrink-0"
              >
                ← Back
              </button>
            )}

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 w-full cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-linear-to-r from-[#00b09b] via-[#2f80ed] to-[#9b51e0] hover:opacity-95
                  active:scale-[0.98] rounded-2xl text-sm sm:text-base font-bold text-white
                  transition-all duration-200 shadow-xl shadow-blue-500/20"
              >
                Continue <span className="ml-1">→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 w-full cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-linear-to-r from-[#00b09b] via-[#2f80ed] to-[#9b51e0] hover:opacity-95
                  active:scale-[0.98] rounded-2xl text-sm sm:text-base font-bold text-white
                  transition-all duration-200 shadow-xl shadow-blue-500/20
                  disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit Booking <span className="ml-1">→</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
