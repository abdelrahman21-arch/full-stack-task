CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "referrals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "patient_first_name" varchar(120) NOT NULL,
  "patient_last_name" varchar(120) NOT NULL,
  "dob" date NOT NULL,
  "phone" varchar(32) NOT NULL,
  "email" varchar(255) NOT NULL,
  "law_firm" varchar(255) NOT NULL,
  "attorney_name" varchar(255) NOT NULL,
  "attorney_email" varchar(255) NOT NULL,
  "attorney_phone" varchar(32) NOT NULL,
  "complaint" text NOT NULL,
  "clinic_location" varchar(255) NOT NULL,
  "appointment_type" varchar(32) NOT NULL,
  "status" varchar(32) NOT NULL DEFAULT 'new',
  "created_at" timestamptz NOT NULL DEFAULT now()
);

