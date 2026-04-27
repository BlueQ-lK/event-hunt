CREATE TABLE "event_interests" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"event_id" varchar(20) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_event_user_interest" UNIQUE("event_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "festival_hubs" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" text,
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"owner_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hub_followers" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"hub_id" varchar(20) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_hub_user_follow" UNIQUE("hub_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "hub_id" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "event_interests" ADD CONSTRAINT "event_interests_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hub_followers" ADD CONSTRAINT "hub_followers_hub_id_festival_hubs_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."festival_hubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_hub_id_festival_hubs_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."festival_hubs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "hub_name";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "hub_image";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "visibility";