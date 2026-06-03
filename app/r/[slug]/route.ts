import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { links, clicks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const [link] = await db.select().from(links).where(eq(links.shortSlug, slug));

    if (!link) {
        return new NextResponse("Not Found", { status: 404 });
    }

    // ثبت کلیک بدون block کردن ریدایرکت
    db.insert(clicks).values({ linkId: link.id }).catch(() => {});

    return redirect(link.originalUrl); // next/navigation => 307
}
