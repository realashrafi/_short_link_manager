DROP INDEX "links_short_slug_uq";--> statement-breakpoint
CREATE UNIQUE INDEX "links_user_slug_unique" ON "links" USING btree ("user_id","short_slug");