import { VerificationType } from "../enums/verification.type";
import { User } from "./user";

export type OneTimePassword = {
  verification_type: VerificationType;
  user: User;
};
