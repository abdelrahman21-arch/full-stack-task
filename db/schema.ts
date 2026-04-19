import {
  date,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const referrals = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientFirstName: varchar("patient_first_name", { length: 120 }).notNull(),
  patientLastName: varchar("patient_last_name", { length: 120 }).notNull(),
  dob: date("dob", { mode: "string" }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  lawFirm: varchar("law_firm", { length: 255 }).notNull(),
  attorneyName: varchar("attorney_name", { length: 255 }).notNull(),
  attorneyEmail: varchar("attorney_email", { length: 255 }).notNull(),
  attorneyPhone: varchar("attorney_phone", { length: 32 }).notNull(),
  complaint: text("complaint").notNull(),
  clinicLocation: varchar("clinic_location", { length: 255 }).notNull(),
  appointmentType: varchar("appointment_type", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ReferralRow = typeof referrals.$inferSelect;
export type NewReferralRow = typeof referrals.$inferInsert;

