ALTER TABLE "session" RENAME COLUMN "schedule_id" TO "payment_id";--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "billing_key" varchar(255) NOT NULL;