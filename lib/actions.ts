"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "./db";
import { links } from "./db/schema";

const createLinkSchema = z.object({
    originalUrl: z.string().url("لینک معتبر وارد کنید"),
    title: z.string().optional(),
});

export type CreateShortLinkState =
    | {
    ok: true;
    slug: string;
}
    | {
    ok: false;
    fieldErrors?: {
        originalUrl?: string[];
        title?: string[];
    };
    formError?: string;
};

export async function createShortLink(
    _prevState: CreateShortLinkState | undefined,
    formData: FormData
): Promise<CreateShortLinkState> {
    const parsed = createLinkSchema.safeParse({
        originalUrl: formData.get("url"),
        title: formData.get("title") || undefined,
    });

    if (!parsed.success) {
        return {
            ok: false,
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    const { originalUrl, title } = parsed.data;
    const shortSlug = nanoid(8);

    try {
        await db.insert(links).values({
            userId: "anonymous",
            originalUrl,
            title: title ?? null,
            shortSlug,
        });

        revalidatePath("/");
        return { ok: true, slug: shortSlug };
    } catch {
        return { ok: false, formError: "خطایی در دیتابیس رخ داد" };
    }
}
