import { db } from "@/lib/db";
import { links, clicks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // ۱. پیدا کردن لینک در دیتابیس
    const [link] = await db
        .select()
        .from(links)
        .where(eq(links.shortSlug, slug));

    if (!link) {
        return new NextResponse("لینک یافت نشد", { status: 404 });
    }

    // ۲. ثبت کلیک (بدون بلاک کردن ریدایرکت)
    // ما از یک transaction ساده یا async/await استفاده می‌کنیم
    // برای سرعت بالاتر، ثبت کلیک را در پس‌زمینه انجام می‌دهیم (fire and forget)
    db.insert(clicks)
        .values({ linkId: link.id })
        .catch((err) => console.error("خطا در ثبت کلیک:", err));

    // ۳. ریدایرکت به آدرس اصلی
    return redirect(link.originalUrl);
}
