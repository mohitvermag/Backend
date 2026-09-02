import z from "zod";

const passwordRules = z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long")
    .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );

export const registerUserSchema = z
    .object({
        username: z.string().trim().min(3, "Username must be at least 3 characters long"),
        email: z.string().trim().email("Please enter a valid email address"),
        mobile: z.string().trim().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
        password: passwordRules,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginUserSchema = z.object({
    identifier: z.string().trim().min(1, "Email or mobile number is required"),
    password: z.string().min(1, "Password is required"),
});

export const requestForgotPasswordSchema = z.object({
    identifier: z.string().trim().min(1, "Email or mobile number is required"),
});

export const verifyForgotPasswordOTPSchema = z.object({
    identifier: z.string().trim().min(1, "Identifier is required"),
    otp: z.string().trim().length(6, "OTP must be exactly 6 digits"),
});

export const resetPasswordSchema = z
    .object({
        resetToken: z.string().trim().min(1, "Reset token is required"),
        newPassword: passwordRules,
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
