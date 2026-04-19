export type {
  AppError,
  ReferralFormInput,
  ReferralRecord,
  ReferralStatus,
  SubmitReferralResult,
} from "@repo/schemas";

import type { ReferralFormInput } from "@repo/schemas";

export type AppointmentType = ReferralFormInput["appointmentType"];
