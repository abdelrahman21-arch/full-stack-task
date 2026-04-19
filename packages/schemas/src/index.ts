import { z } from "zod";

export const appointmentTypes = ["In-Person", "Telemedicine"] as const;
export const referralStatuses = ["new"] as const;

const nameField = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(120, "Must be 120 characters or fewer.");

const emailField = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .max(255, "Must be 255 characters or fewer.");

const phoneField = z
  .string()
  .trim()
  .regex(/^[0-9()+\-\s.]{7,20}$/, "Enter a valid phone number.");

export const referralFormSchema = z.object({
  patientFirstName: nameField,
  patientLastName: nameField,
  dob: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD format."),
  phone: phoneField,
  email: emailField,
  lawFirm: z
    .string()
    .trim()
    .min(1, "Law firm is required.")
    .max(255, "Must be 255 characters or fewer."),
  attorneyName: z
    .string()
    .trim()
    .min(1, "Attorney name is required.")
    .max(255, "Must be 255 characters or fewer."),
  attorneyEmail: emailField,
  attorneyPhone: phoneField,
  complaint: z
    .string()
    .trim()
    .min(1, "Complaint is required.")
    .max(500, "Complaint must be 500 characters or fewer."),
  clinicLocation: z
    .string()
    .trim()
    .min(1, "Clinic location is required.")
    .max(255, "Must be 255 characters or fewer."),
  appointmentType: z.enum(appointmentTypes, {
    error: "Select an appointment type.",
  }),
});

export const referralStatusSchema = z.enum(referralStatuses);

export const referralRecordSchema = referralFormSchema.extend({
  id: z.string().uuid(),
  status: referralStatusSchema,
  createdAt: z.string().datetime(),
});

export const appErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  issues: z
    .array(
      z.object({
        path: z.string(),
        message: z.string(),
      }),
    )
    .optional(),
});

export const submitReferralSuccessSchema = z.object({
  success: z.literal(true),
  referralId: z.string().uuid(),
});

export const submitReferralFailureSchema = z.object({
  success: z.literal(false),
  error: appErrorSchema,
});

export const submitReferralResultSchema = z.union([
  submitReferralSuccessSchema,
  submitReferralFailureSchema,
]);

export type ReferralFormSchema = typeof referralFormSchema;
export type ReferralFormInput = z.infer<typeof referralFormSchema>;
export type ReferralRecord = z.infer<typeof referralRecordSchema>;
export type ReferralStatus = z.infer<typeof referralStatusSchema>;
export type AppError = z.infer<typeof appErrorSchema>;
export type SubmitReferralResult = z.infer<typeof submitReferralResultSchema>;
