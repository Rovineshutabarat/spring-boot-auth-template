import z from "zod/v3";

export const VerificationType = z.enum([
  "ACCOUNT_VERIFICATION",
  "PASSWORD_RESET",
]);
export type VerificationType = z.infer<typeof VerificationType>;
