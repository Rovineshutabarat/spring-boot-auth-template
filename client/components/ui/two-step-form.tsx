"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { z } from "zod/v3";
import { useRouter } from "next/navigation";

type TwoStepFormProps = {
  mode: "verify-account" | "forgot-password";
};

type OneTimePasswordRequest = z.infer<typeof OneTimePasswordRequest>;
const TwoStepForm = ({ mode }: TwoStepFormProps) => {
  const { verifyAccount, sendOneTimePassword, verifyPasswordReset, isLoading } =
    useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState<number>(120);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  React.useEffect(() => {
    const email = sessionStorage.getItem("verification_email");
    setEmail(email);
    if (!email) {
      router.back();
    } else {
      sendOneTimePassword({ email: email });
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OneTimePasswordRequest),
    mode: "onSubmit",
  });

  const title =
    mode === "verify-account" ? "Verify Your Account" : "Reset Your Password";

  const description =
    mode === "verify-account"
      ? "Please enter the 6-digit code sent to your email to verify your account."
      : "Please enter the 6-digit code sent to your email to reset your password.";

  function handleResendOtp() {
    if (!email) {
      router.back();
    } else {
      sendOneTimePassword({ email: email });
      setCooldown(120);
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5 md:px-0">
      <div className="flex w-full items-center justify-center px-4 py-12 md:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="flex items-center flex-col space-y-4">
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <InputOTP
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    if (val.length === 6) {
                      handleSubmit((data: OneTimePasswordRequest) => {
                        mode === "verify-account"
                          ? verifyAccount(data)
                          : verifyPasswordReset(data);
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

export default TwoStepForm;
