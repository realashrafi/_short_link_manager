"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "./db";
import { links } from "./db/schema";

// ۱. آپدیت اسکیما برای پذیرش اسلاگ اختیاری
const createLinkSchema = z.object({
    originalUrl: z.string().url("لینک معتبر وارد کنید"),
    title: z.string().optional(),
    slug: z.string()
        .regex(/^[a-zA-Z0-9-]+$/, "فقط حروف، عدد و خط تیره")
        .optional()
        .or(z.literal("")),
});

// ۲. آپدیت تایپ برای شامل شدن فیلد slug در ارورها
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
        slug?: string[]; // این فیلد اضافه شد
    };
    formError?: string;
};

export async function createShortLink(
    _prevState: CreateShortLinkState | undefined,
    formData: FormData
): Promise<CreateShortLinkState> {
    // ۳. خواندن داده‌ها با نام‌های صحیح از فرم
    const parsed = createLinkSchema.safeParse({
        originalUrl: formData.get("originalUrl"), // نام فیلد در فرم باید همین باشد
        title: formData.get("title") || undefined,
        slug: formData.get("slug") || undefined,
    });

    if (!parsed.success) {
        return {
            ok: false,
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    const { originalUrl, title, slug } = parsed.data;

    // ۴. اگر کاربر اسلاگ نداده بود، nanoid بساز
    const finalSlug = slug && slug.trim() !== "" ? slug : nanoid(8);

    try {
        await db.insert(links).values({
            userId: "anonymous",
            originalUrl,
            title: title ?? null,
            shortSlug: finalSlug,
        });

        revalidatePath("/");
        return { ok: true, slug: finalSlug };
    } catch (error: any) {
        // چک کردن تکراری بودن اسلاگ (Unique Constraint)
        if (error.code === "23505") {
            return {
                ok: false,
                fieldErrors: { slug: ["این اسلاگ قبلاً رزرو شده است"] }
            };
        }
        return { ok: false, formError: "خطایی در دیتابیس رخ داد" };
    }
}
