"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { getPendingVerification } from "@/lib/pending-verification";
import { formatCooldown, useOtpCooldown } from "@/lib/otp-cooldown";
import { VerificationType } from "@/types/enums/verification.type";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const Page = () => {
  const { verifyOneTimePassword, sendOtp, isVerifyingOtp, isSendingOtp } =
    useAuth();
  const router = useRouter();

  const [email, setEmail] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  const { cooldown, sync } = useOtpCooldown(VerificationType.Values.FORGOT_PASSWORD);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OneTimePasswordRequest),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    const stored = getPendingVerification();
    if (!stored) {
      router.replace("/auth/forgot-password");
      return;
    }
    setEmail(stored.email);
    setReady(true);
  }, [router]);

  const wasSending = React.useRef(false);

  React.useEffect(() => {
    if (isSendingOtp) {
      wasSending.current = true;
      return;
    }
    if (wasSending.current) {
      wasSending.current = false;
      sync();
    }
  }, [isSendingOtp, sync]);

  if (!ready || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  function handleResendOtp() {
    if (!email) return;
    sendOtp({
      email,
      verificationType: VerificationType.Values.FORGOT_PASSWORD,
    });
  }

  const busy = isVerifyingOtp || isSendingOtp;

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5 md:px-0">
      <div className="flex w-full items-center justify-center px-4 py-12 md:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold">Reset Your Password</h1>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit reset code to {email}. Enter it below to
              continue. The code expires in 5 minutes.
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
                        verifyOneTimePassword(
                          data,
                          email,
                          VerificationType.Values.FORGOT_PASSWORD,
                        );
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
            <p>Didn&apos;t receive the code?</p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={busy || cooldown > 0}
              className="font-medium text-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {cooldown > 0
                ? `Resend code in (${formatCooldown(cooldown)})`
                : "Resend code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
