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

// مهم: initialState باید دقیقاً از نوع union واقعی اکشن باشد
const initialState: CreateShortLinkState = { ok: false };

export function ShortLinkForm() {
    const [state, action] = useActionState(createShortLink, initialState);

    const urlErrors = !state.ok ? state.fieldErrors?.originalUrl : undefined;
    const titleErrors = !state.ok ? state.fieldErrors?.title : undefined;
    const slugErrors = !state.ok ? state.fieldErrors?.slug : undefined;
    const formError = !state.ok ? state.formError : undefined;

    return (
        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <Input name="originalUrl" placeholder="لینک طولانی..." required />
                {urlErrors?.[0] ? (
                    <p className="text-sm text-red-600">{urlErrors[0]}</p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Input name="title" placeholder="عنوان (اختیاری)" />
                {titleErrors?.[0] ? (
                    <p className="text-sm text-red-600">{titleErrors[0]}</p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Input name="slug" placeholder="اسلاگ دلخواه (اختیاری)" />
                {slugErrors?.[0] ? (
                    <p className="text-sm text-red-600">{slugErrors[0]}</p>
                ) : null}
            </div>

            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

            {state.ok ? (
                <p className="text-sm text-green-700">
                    ساخته شد: <span className="font-mono">{state.slug}</span>
                </p>
            ) : null}

            <SubmitButton />
        </form>
    );
}
