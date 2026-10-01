import { VerificationType } from "@/types/enums/verification.type";
import React from "react";

export const OTP_COOLDOWN_SECONDS = 60;

function keyFor(type: VerificationType): string {
  return `otp_last_sent_${type.toLowerCase()}`;
}

function readTimestamp(type: VerificationType): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(keyFor(type));
  return raw ? Number(raw) : 0;
}

export function saveOtpTimestamp(type: VerificationType): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(keyFor(type), Date.now().toString());
}

export function getRemainingCooldown(type: VerificationType): number {
  const lastSent = readTimestamp(type);
  if (!lastSent) return 0;

  const diff =
    OTP_COOLDOWN_SECONDS - Math.floor((Date.now() - lastSent) / 1000);

  return diff > 0 ? diff : 0;
}

export function isOtpFresh(type: VerificationType): boolean {
  return getRemainingCooldown(type) > 0;
}

export function clearOtpTimestamp(type?: VerificationType): void {
  if (typeof window === "undefined") return;
  if (type) {
    localStorage.removeItem(keyFor(type));
    return;
  }
  (
    Object.values(VerificationType.Values) as VerificationType[]
  ).forEach((t) => localStorage.removeItem(keyFor(t)));
}

export function formatCooldown(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function useOtpCooldown(type: VerificationType) {
  const [cooldown, setCooldown] = React.useState<number>(() =>
    getRemainingCooldown(type),
  );

  React.useEffect(() => {
    setCooldown(getRemainingCooldown(type));
  }, [type]);

  React.useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const restart = React.useCallback(() => {
    saveOtpTimestamp(type);
    setCooldown(OTP_COOLDOWN_SECONDS);
  }, [type]);

  const sync = React.useCallback(() => {
    setCooldown(getRemainingCooldown(type));
  }, [type]);

  return { cooldown, restart, sync };
}
