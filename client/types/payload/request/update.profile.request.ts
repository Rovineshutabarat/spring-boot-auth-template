import { z } from "zod/v3";

export const UpdateProfileRequest = z.object({
  username: z
    .string({ required_error: "Username cannot be blank" })
    .min(1, { message: "Username cannot be blank" })
    .min(5, {
      message: "Username is too short. Please enter at least 5 characters",
    })
    .max(50, {
      message: "Username is too long. Please enter no more than 50 characters",
    }),

  email: z
    .string({ required_error: "Email cannot be blank" })
    .min(1, { message: "Email cannot be blank" })
    .email({ message: "Please provide a valid email address" })
    .min(5, {
      message: "Email is too short. Please enter at least 5 characters",
    })
    .max(100, {
      message: "Email is too long. Please enter no more than 100 characters",
    }),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequest>;
