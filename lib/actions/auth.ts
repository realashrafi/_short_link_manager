"use server";

import { authClient } from "@/lib/auth";
import { authSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AuthActionState = {
    data?: string;
    error?: string;
};

export async function signUpAction(
    prevState: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const rawData = Object.fromEntries(formData.entries());

    const validated = authSchema.safeParse(rawData);

    if (!validated.success) {
        return {
            error: validated.error.issues[0]?.message ?? "اطلاعات وارد شده معتبر نیست",
        };
    }

    try {
        const { email, password } = validated.data;

        await authClient.signUp.email({
            email,
            password,
            name: email.split("@")[0],
        });

        revalidatePath("/");

        return {
            data: "ثبت‌نام با موفقیت انجام شد",
        };
    } catch {
        return {
            error: "خطا در ثبت‌نام. احتمالاً ایمیل قبلاً استفاده شده است.",
        };
    }
}

export async function signInAction(
    prevState: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const rawData = Object.fromEntries(formData.entries());

    const validated = authSchema.safeParse(rawData);

    if (!validated.success) {
        return {
            error: validated.error.issues[0]?.message ?? "اطلاعات وارد شده معتبر نیست",
        };
    }

    try {
        await authClient.signIn.email({
            email: validated.data.email,
            password: validated.data.password,
        });

        revalidatePath("/");
    } catch {
        return {
            error: "ایمیل یا رمز عبور اشتباه است",
        };
    }

    redirect("/dashboard");
}

export async function signOutAction() {
    try {
        await authClient.signOut();
    } catch {
        // intentionally ignored
    }

    redirect("/login");
}
