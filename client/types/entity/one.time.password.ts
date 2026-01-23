import { VerificationType } from "../enums/verification.type";
import { User } from "./user";

export type OneTimePassword = {
  code: string;
  verification_type: VerificationType;
  user: User;
};
