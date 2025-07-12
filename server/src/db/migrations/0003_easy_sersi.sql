ALTER TABLE "rooms" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "original_file_name" text;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "original_file_type" text;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "original_file_content" text;