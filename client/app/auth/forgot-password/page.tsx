"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import {
  formatCooldown,
  useOtpCooldown,
} from "@/lib/otp-cooldown";
import { VerificationType } from "@/types/enums/verification.type";
import { SendOtpRequest } from "@/types/payload/request/send-otp.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function page() {
  const { sendOtp, isSendingOtp } = useAuth();
  const { cooldown } = useOtpCooldown(VerificationType.Values.FORGOT_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendOtpRequest>({
    resolver: zodResolver(SendOtpRequest),
    mode: "onSubmit",
    defaultValues: {
      verificationType: VerificationType.Values.FORGOT_PASSWORD,
    },
  });

  const onSubmit: SubmitHandler<SendOtpRequest> = (data) => {
    sendOtp({
      email: data.email,
      verificationType: VerificationType.Values.FORGOT_PASSWORD,
    });
  };

  return (
    <div>
      <div className="flex min-h-screen w-full items-center justify-center px-5 md:px-0">
        <div className="flex w-full items-center justify-center px-4 py-12 md:w-1/2 lg:px-8">
          <div className="mx-auto w-full max-w-sm space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email address and we&apos;ll send you a verification code
                to reset your password.
              </p>
            </div>

            <div className="space-y-6">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Your Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-destructive text-sm">
                      *{errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full cursor-pointer"
                  type="submit"
                  disabled={isSendingOtp || cooldown > 0}
                >
                  {isSendingOtp ? (
                    <div className="flex items-center space-x-2">
                      <div
                        className="inline-block h-4 w-4 animate-spin rounded-full border-3 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_0.4s_linear_infinite] dark:text-slate-700"
                        role="status"
                      ></div>
                      <p>Please wait...</p>
                    </div>
                  ) : cooldown > 0 ? (
                    `Resend code in (${formatCooldown(cooldown)})`
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
