import z from "zod/v3";

export const VerificationType = z.enum([
  "ACCOUNT_VERIFICATION",
  "FORGOT_PASSWORD",
]);
export type VerificationType = z.infer<typeof VerificationType>;
