"use server";

import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { requireUser } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const shortLinkSchema = z.object({
    originalUrl: z.string().url("URL معتبر نیست"),
    shortSlug: z.string().min(3).max(50),
});

export type ShortLinkState = {
    data?: string;
    error?: string;
};

export async function createShortLink(
    prevState: ShortLinkState,
    formData: FormData
): Promise<ShortLinkState> {

    const user = await requireUser();

    if (!user) {
        return { error: "ابتدا باید وارد حساب کاربری شوید." };
    }

    const rawData = Object.fromEntries(formData.entries());
    const validated = shortLinkSchema.safeParse(rawData);

    if (!validated.success) {
        return {
            error:
                validated.error.issues[0]?.message ??
                "اطلاعات معتبر نیست",
        };
    }

    const { originalUrl, shortSlug } = validated.data;

    try {
        const existing = await db.query.links.findFirst({
            where: (table, { and, eq }) =>
                and(
                    eq(table.userId, user.id),
                    eq(table.shortSlug, shortSlug)
                ),
        });

        if (existing) {
            return { error: "این اسلاگ قبلاً توسط شما استفاده شده است." };
        }

        await db.insert(links).values({
            userId: user.id,
            originalUrl,
            shortSlug,
        });

        revalidatePath("/dashboard");

        return { data: "لینک با موفقیت ساخته شد." };

    } catch {
        return { error: "خطا در ساخت لینک." };
    }
}
