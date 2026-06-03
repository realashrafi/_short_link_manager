"use client";

import {signOutAction} from "@/lib/actions/auth";
import {Button} from "@/components/ui/button";

export function LogoutButton() {
    return (
        <form action={signOutAction}>
            <Button
                type="submit"
                variant="destructive"
                size="sm"
            >
                Logout
            </Button>
        </form>
    );
}
