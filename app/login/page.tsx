"use client";

import { useActionState } from "react";
import { signInAction, AuthActionState } from "@/lib/actions/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: AuthActionState = {};

export default function LoginPage() {
    const [state, formAction] = useActionState(signInAction, initialState);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>

                <CardContent>
                    <form action={formAction} className="space-y-4">

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input name="email" type="email" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input name="password" type="password" required />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-red-500">{state.error}</p>
                        )}

                        <Button type="submit" className="w-full">
                            Login
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
