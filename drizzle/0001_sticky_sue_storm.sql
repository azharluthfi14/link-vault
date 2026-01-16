ALTER TABLE "short_links" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "short_links" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."link_status";--> statement-breakpoint
CREATE TYPE "public"."link_status" AS ENUM('active', 'disabled');--> statement-breakpoint
ALTER TABLE "short_links" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."link_status";--> statement-breakpoint
ALTER TABLE "short_links" ALTER COLUMN "status" SET DATA TYPE "public"."link_status" USING "status"::"public"."link_status";