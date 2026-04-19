import { desc } from "drizzle-orm";
import { referralFormSchema } from "@repo/schemas";
import type { ReferralRecord, SubmitReferralResult } from "@repo/types";
import { referrals } from "../../../../db/schema.js";
import { db } from "../db.js";
import { publicProcedure, router } from "../trpc.js";

function mapReferralRecord(record: typeof referrals.$inferSelect): ReferralRecord {
  return {
    id: record.id,
    patientFirstName: record.patientFirstName,
    patientLastName: record.patientLastName,
    dob: record.dob,
    phone: record.phone,
    email: record.email,
    lawFirm: record.lawFirm,
    attorneyName: record.attorneyName,
    attorneyEmail: record.attorneyEmail,
    attorneyPhone: record.attorneyPhone,
    complaint: record.complaint,
    clinicLocation: record.clinicLocation,
    appointmentType: record.appointmentType as ReferralRecord["appointmentType"],
    status: record.status as ReferralRecord["status"],
    createdAt: record.createdAt.toISOString(),
  };
}

export const referralRouter = router({
  submitReferral: publicProcedure
    .input(referralFormSchema)
    .mutation(async ({ input }): Promise<SubmitReferralResult> => {
      try {
        const [createdReferral] = await db
          .insert(referrals)
          .values({
            ...input,
            status: "new",
          })
          .returning({ id: referrals.id });

        return {
          success: true,
          referralId: createdReferral.id,
        };
      } catch (error) {
        console.error("Failed to submit referral", error);

        return {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Unable to save the referral right now.",
          },
        };
      }
    }),
  getReferrals: publicProcedure.query(async (): Promise<ReferralRecord[]> => {
    const result = await db
      .select()
      .from(referrals)
      .orderBy(desc(referrals.createdAt));

    return result.map(mapReferralRecord);
  }),
});
