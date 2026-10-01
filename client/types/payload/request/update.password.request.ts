import { z } from "zod/v3";

export const UpdatePasswordRequest = z
  .object({
    email: z
      .string()
      .email({ message: "Please provide a valid email address" })
      .min(5, {
        message: "Email is too short. Please enter at least 5 characters",
      })
      .max(100, {
        message: "Email is too long. Please enter no more than 100 characters",
      })
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: "Password cannot be blank" })
      .min(1, { message: "Password cannot be blank" })
      .min(6, {
        message: "Password is too short. Please enter at least 6 characters",
      })
      .max(100, {
        message:
          "Password is too long. Please enter no more than 100 characters",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, ...data }) => data);

export type UpdatePasswordRequest = z.infer<typeof UpdatePasswordRequest>;
