import { db } from "./index";
import { links, clicks } from "./schema";
import { desc, eq, count } from "drizzle-orm";

export async function getLinks() {
    return await db
        .select({
            id: links.id,
            title: links.title,
            shortSlug: links.shortSlug,
            originalUrl: links.originalUrl,
            createdAt: links.createdAt,
            clickCount: count(clicks.id),
        })
        .from(links)
        .leftJoin(clicks, eq(clicks.linkId, links.id))
        .groupBy(links.id)
        .orderBy(desc(links.createdAt));
}
