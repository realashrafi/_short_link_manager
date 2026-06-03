
import { createAuthClient } from "@neondatabase/neon-js/auth";

const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;

if (!authUrl) {
    throw new Error("Missing NEXT_PUBLIC_NEON_AUTH_URL in .env.local");
}

export const authClient = createAuthClient(authUrl);
