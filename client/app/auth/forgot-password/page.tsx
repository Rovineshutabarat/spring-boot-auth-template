"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/auth.service";
import { VerificationType } from "@/types/enums/verification.type";
import { EmailRequest } from "@/types/payload/request/email.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailRequest>({
    resolver: zodResolver(EmailRequest),
    mode: "onSubmit",
    defaultValues: {
      verificationType: VerificationType.Values.PASSWORD_RESET,
    },
  });

  const onSubmit: SubmitHandler<EmailRequest> = async (data) => {
    setIsLoading(true);
    await AuthService.findUserByEmail(data.email)
      .then(
        (res) =>
          res.code === 200 &&
          router.replace(
            `/auth/verify?email=${data.email}&type=${VerificationType.Values.PASSWORD_RESET}`,
          ),
      )
      .catch(() =>
        toast.error("Failed to send verification code. Please try again."),
      )
      .finally(() => {
        setIsLoading(false);
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
                Enter your email address and we'll send you a verification code
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

                <Button className="w-full cursor-pointer" type="submit">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div
                        className="inline-block h-4 w-4 animate-spin rounded-full border-3 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_0.4s_linear_infinite] dark:text-slate-700"
                        role="status"
                      ></div>
                      <p>Please Wait..</p>
                    </div>
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
