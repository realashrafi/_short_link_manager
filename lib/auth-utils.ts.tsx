// src/lib/auth-utils.ts
import { authClient } from "./auth";
import { headers } from "next/headers";

export async function getSession() {
    try {
        // در نکسوس برای گرفتن سشن در سرور معمولاً نیاز به پاس دادن هدرهاست
        const session = await authClient.getSession({
            fetchOptions: {
                headers: await headers(),
            },
        });
        return session;
    } catch (error) {
        return null;
    }
}
