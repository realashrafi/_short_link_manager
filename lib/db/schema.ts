import {
    pgTable,
    text,
    timestamp,
    integer,
    uuid,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

export const links = pgTable(
    "links",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        // شناسه کاربر از Neon Auth
        userId: text("user_id").notNull(),

        title: text("title"),
        originalUrl: text("original_url").notNull(),

        // اسلاگ کوتاه
        shortSlug: text("short_slug").notNull(),

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (t) => [
        uniqueIndex("links_user_slug_unique").on(t.userId, t.shortSlug),

        index("links_user_id_idx").on(t.userId),
    ]
);

export const clicks = pgTable(
    "clicks",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        linkId: uuid("link_id")
            .notNull()
            .references(() => links.id, { onDelete: "cascade" }),

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (t) => [index("clicks_link_id_created_at_idx").on(t.linkId, t.createdAt)]
);
