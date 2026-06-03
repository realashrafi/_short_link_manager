"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createShortLink, type CreateShortLinkState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "در حال ساخت..." : "کوتاه‌سازی"}
        </Button>
    );
}

const initialState: CreateShortLinkState = { ok: false };

export function ShortLinkForm() {
    const [state, action] = useActionState(createShortLink, initialState);

    const urlErrors = !state.ok ? state.fieldErrors?.originalUrl : undefined;
    const formError = !state.ok ? state.formError : undefined;

    return (
        <form action={action} className="space-y-2">
            <div className="flex gap-2">
                <Input name="url" placeholder="لینک طولانی..." required />
                <SubmitButton />
            </div>

            {urlErrors?.[0] ? <p className="text-sm text-red-600">{urlErrors[0]}</p> : null}
            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

            {state.ok ? (
                <p className="text-sm text-green-700">
                    ساخته شد: <span className="font-mono">{state.slug}</span>
                </p>
            ) : null}
        </form>
    );
}
