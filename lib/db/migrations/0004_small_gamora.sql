CREATE TABLE "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer,
	"schedule_id" varchar NOT NULL,
	"customer_id" varchar NOT NULL,
	"product_id" varchar,
	"price_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "teams" RENAME COLUMN "stripe_customer_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "teams" RENAME COLUMN "stripe_subscription_id" TO "subscription_id";--> statement-breakpoint
ALTER TABLE "teams" RENAME COLUMN "stripe_product_id" TO "product_id";--> statement-breakpoint
ALTER TABLE "teams" DROP CONSTRAINT "teams_stripe_customer_id_unique";--> statement-breakpoint
ALTER TABLE "teams" DROP CONSTRAINT "teams_stripe_subscription_id_unique";--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "public"."prices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_customer_id_unique" UNIQUE("customer_id");--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_subscription_id_unique" UNIQUE("subscription_id");