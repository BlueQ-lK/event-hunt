CREATE TYPE "public"."event_category" AS ENUM('tech', 'music', 'sports', 'education', 'business', 'art', 'health', 'food', 'travel', 'other');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"start_time" varchar(10),
	"end_time" varchar(10),
	"location_name" varchar(255),
	"address" text,
	"city" varchar(100),
	"category" "event_category",
	"banner_image" text,
	"brochure" text,
	"hub_id" varchar(100),
	"hub_name" varchar(255) NOT NULL,
	"hub_image" text,
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
