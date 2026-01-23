"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { VerificationType } from "@/types/enums/verification.type";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const COOLDOWN_SECONDS = 120;
const OTP_LAST_SENT_KEY = "otp_last_sent_at";

function saveOtpTimestamp() {
  localStorage.setItem(OTP_LAST_SENT_KEY, Date.now().toString());
}

function getRemainingCooldown(): number {
  const lastSent = localStorage.getItem(OTP_LAST_SENT_KEY);
  if (!lastSent) return 0;

  const diff =
    COOLDOWN_SECONDS - Math.floor((Date.now() - Number(lastSent)) / 1000);

  return diff > 0 ? diff : 0;
}

const Page = () => {
  const { verifyOneTimePassword, sendOneTimePassword, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") as string;
  const type = searchParams.get("type") as VerificationType;

  const [cooldown, setCooldown] = React.useState<number>(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OneTimePasswordRequest),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (!email || !type) {
      router.back();
      return;
    }
    sessionStorage.clear();
    const remaining = getRemainingCooldown();

    if (remaining > 0) {
      setCooldown(remaining);
    } else {
      sendOneTimePassword({ email, verificationType: type });
      saveOtpTimestamp();
      setCooldown(COOLDOWN_SECONDS);
    }
  }, []);

  React.useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  function handleResendOtp() {
    if (!email || !type) {
      router.back();
      return;
    }

    sendOneTimePassword({ email, verificationType: type });
    saveOtpTimestamp();
    setCooldown(COOLDOWN_SECONDS);
  }

  function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5 md:px-0">
      <div className="flex w-full items-center justify-center px-4 py-12 md:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold">
              {type === VerificationType.Values.ACCOUNT_VERIFICATION
                ? "Verify Your Account"
                : "Reset Your Password"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {type === VerificationType.Values.ACCOUNT_VERIFICATION
                ? "Please enter the 6-digit code sent to your email to verify your account."
                : "Please enter the 6-digit code sent to your email to reset your password."}
            </p>
          </div>

          <div className="flex items-center flex-col space-y-4">
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <InputOTP
                  autoFocus
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    if (val.length === 6) {
                      handleSubmit((data: OneTimePasswordRequest) => {
                        verifyOneTimePassword(data, email, type);
                      })();
                    }
                  }}
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTPGroup className="space-x-3">
                    {[0, 1, 2].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-14 h-14 border rounded"
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator className="mx-2" />
                  <InputOTPGroup className="space-x-3">
                    {[3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-14 h-14 border rounded"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.code && (
              <p className="mt-1 text-destructive text-sm">
                *{errors.code.message}
              </p>
            )}
          </div>

          <div className="flex justify-center items-center space-x-2 text-sm text-muted-foreground">
            <p>Didn’t receive the code?</p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading || cooldown > 0}
              className="font-medium text-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {cooldown > 0
                ? `Resend OTP in (${formatTime(cooldown)})`
                : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
