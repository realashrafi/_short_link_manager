import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
    const user = await requireUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">
                Welcome {user.email}
            </h1>

            <LogoutButton />
        </div>
    );
}
