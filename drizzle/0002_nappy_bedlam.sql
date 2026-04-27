ALTER TABLE "festival_hubs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "hub_followers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "festival_hubs" CASCADE;--> statement-breakpoint
DROP TABLE "hub_followers" CASCADE;--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_hub_id_festival_hubs_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "hub_id";