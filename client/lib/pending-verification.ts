export type PendingVerification = {
  email: string;
  resetVerified: boolean;
};

const STORAGE_KEY = "pending_verification";

export function setPendingVerification(data: PendingVerification): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPendingVerification(): PendingVerification | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingVerification;
    if (!parsed.email) return null;
    return { email: parsed.email, resetVerified: parsed.resetVerified === true };
  } catch {
    return null;
  }
}

export function clearPendingVerification(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
