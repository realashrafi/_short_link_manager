import { db } from "./index";
import { links } from "./schema";
import { desc } from "drizzle-orm";

export async function getLinks() {
    return await db.select().from(links).orderBy(desc(links.createdAt));
}
