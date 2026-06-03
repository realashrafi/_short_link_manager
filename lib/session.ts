import { authClient } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
    try {
        const session = await authClient.getSession({
            fetchOptions: {
                headers: await headers(),
            },
        });

        return session;
    } catch {
        return null;
    }
}

export async function requireUser() {
    const session = await getSession();

    const user = session?.data?.user;

    if (!user) {
        return null;
    }

    return user;
}
