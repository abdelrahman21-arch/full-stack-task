"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { referralFormSchema } from "@repo/schemas";
import type { AppError, ReferralFormInput } from "@repo/types";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { SuccessMessage } from "./SuccessMessage";
import { trpc } from "../lib/trpc";

const defaultValues: ReferralFormInput = {
  patientFirstName: "",
  patientLastName: "",
  dob: "",
  phone: "",
  email: "",
  lawFirm: "",
  attorneyName: "",
  attorneyEmail: "",
  attorneyPhone: "",
  complaint: "",
  clinicLocation: "",
  appointmentType: "In-Person",
};

function getMutationError(error: unknown): AppError {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null
  ) {
    const data = error.data as {
      code?: string;
      validation?: AppError;
      appError?: AppError;
    };

    if (data.validation) {
      return data.validation;
    }

    if (data.appError) {
      return data.appError;
    }

    return {
      code: data.code ?? "CLIENT_ERROR",
      message: "The server rejected the request.",
    };
  }

  if (error instanceof Error) {
    return {
      code: "NETWORK_ERROR",
      message: error.message,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Something went wrong.",
  };
}

const fieldClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20";

export function ReferralForm() {
  const [serverError, setServerError] = useState<AppError | null>(null);
  const [submittedReferralId, setSubmittedReferralId] = useState<string | null>(null);
 
 const form = useForm<ReferralFormInput>({
    resolver: zodResolver(referralFormSchema),
    defaultValues,
  });
  
  const submitReferral = trpc.referral.submitReferral.useMutation({
    onSuccess(result) {
      if (result.success) {
        setServerError(null);
        setSubmittedReferralId(result.referralId);
        form.reset(defaultValues);
        return;
      }

      setSubmittedReferralId(null);
      setServerError(result.error);
    },
    onError(error) {
      setSubmittedReferralId(null);
      setServerError(getMutationError(error));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-700">
          Referral Form
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Patient intake details</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Submit a referral with shared client and server validation.
        </p>
      </div>

      {submittedReferralId ? <SuccessMessage referralId={submittedReferralId} /> : null}
      {serverError ? <ErrorMessage error={serverError} /> : null}

      <form
        className="grid gap-5"
        onSubmit={handleSubmit((values) => {
          setSubmittedReferralId(null);
          setServerError(null);
          submitReferral.mutate(values);
        })}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Patient First Name
            <input className={fieldClassName} {...register("patientFirstName")} />
            <span className="mt-1 block text-xs text-red-700">{errors.patientFirstName?.message}</span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Patient Last Name
            <input className={fieldClassName} {...register("patientLastName")} />
            <span className="mt-1 block text-xs text-red-700">{errors.patientLastName?.message}</span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Date of Birth
            <input className={fieldClassName} type="date" {...register("dob")} />
            <span className="mt-1 block text-xs text-red-700">{errors.dob?.message}</span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Patient Phone
            <input className={fieldClassName} {...register("phone")} />
            <span className="mt-1 block text-xs text-red-700">{errors.phone?.message}</span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Patient Email
            <input className={fieldClassName} type="email" {...register("email")} />
            <span className="mt-1 block text-xs text-red-700">{errors.email?.message}</span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Clinic Location
            <input className={fieldClassName} {...register("clinicLocation")} />
            <span className="mt-1 block text-xs text-red-700">{errors.clinicLocation?.message}</span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Law Firm
            <input className={fieldClassName} {...register("lawFirm")} />
            <span className="mt-1 block text-xs text-red-700">{errors.lawFirm?.message}</span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Attorney Name
            <input className={fieldClassName} {...register("attorneyName")} />
            <span className="mt-1 block text-xs text-red-700">{errors.attorneyName?.message}</span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Attorney Email
            <input className={fieldClassName} type="email" {...register("attorneyEmail")} />
            <span className="mt-1 block text-xs text-red-700">{errors.attorneyEmail?.message}</span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Attorney Phone
            <input className={fieldClassName} {...register("attorneyPhone")} />
            <span className="mt-1 block text-xs text-red-700">{errors.attorneyPhone?.message}</span>
          </label>
        </div>

        <label className="text-sm font-medium text-slate-700">
          Appointment Type
          <select className={fieldClassName} {...register("appointmentType")}>
            <option value="In-Person">In-Person</option>
            <option value="Telemedicine">Telemedicine</option>
          </select>
          <span className="mt-1 block text-xs text-red-700">{errors.appointmentType?.message}</span>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Complaint
          <textarea className={`${fieldClassName} min-h-36 resize-y`} maxLength={500} {...register("complaint")} />
          <span className="mt-1 block text-xs text-red-700">{errors.complaint?.message}</span>
        </label>

        <button
          className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={submitReferral.isPending}
          type="submit"
        >
          {submitReferral.isPending ? "Submitting..." : "Submit Referral"}
        </button>
      </form>
    </div>
  );
}

