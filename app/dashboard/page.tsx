import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
    const user = await requireUser();

    if (!user) {
        redirect("/login");
    }

    const userLinks = await db.query.links.findMany({
        where: eq(links.userId, user.id),
    });

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">
                    Welcome {user.email}
                </h1>
                <LogoutButton />
            </div>

            <div className="space-y-2">
                {userLinks.map((link) => (
                    <div
                        key={link.id}
                        className="border p-3 rounded-md"
                    >
                        <p className="font-medium">
                            /{link.shortSlug}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {link.originalUrl}
                        </p>
                    </div>
                ))}

                {userLinks.length === 0 && (
                    <p className="text-muted-foreground">
                        هنوز لینکی نساخته‌اید.
                    </p>
                )}
            </div>
        </div>
    );
}
