import { z } from "zod";

export const authSchema = z.object({
    email: z.string().email("ایمیل معتبر نیست"),
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export type AuthInput = z.infer<typeof authSchema>;
