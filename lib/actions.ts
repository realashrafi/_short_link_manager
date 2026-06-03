"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "./db";
import { links } from "./db/schema";

const schema = z.object({
    originalUrl: z.string().url({ message: "لینک معتبر وارد کنید" }),
    title: z.string().optional(),
});

export async function createShortLink(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        originalUrl: formData.get("url"),
        title: formData.get("title"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { originalUrl, title } = validatedFields.data;
    const shortSlug = nanoid(8); // تولید اسلاگ ۸ کاراکتری

    try {
        await db.insert(links).values({
            userId: "anonymous", // فعلا به صورت پیش‌فرض (بعداً با Auth جایگزین می‌شود)
            originalUrl,
            title: title || "بدون عنوان",
            shortSlug,
        });

        revalidatePath("/"); // رفرش کردن دیتا در UI
        return { success: true, slug: shortSlug };
    } catch (error) {
        return { error: { _form: ["خطایی در دیتابیس رخ داد"] } };
    }
}
