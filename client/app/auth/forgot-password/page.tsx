"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod/v3";
import { EmailRequest } from "@/types/payload/request/email.request";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/payload/response/common/error.response";

type EmailRequest = z.infer<typeof EmailRequest>;
const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmailRequest),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<EmailRequest> = async (data: EmailRequest) => {
    try {
      setIsLoading(true);
      await AuthService.findUserByEmail(data.email);
      sessionStorage.clear();
      sessionStorage.setItem("verification_email", data.email);
      router.push("/auth/verify-password-reset");
    } catch (error: any) {
      const parsedBody = error.parsedBody as ErrorResponse;
      toast.error(parsedBody.message);
    } finally {
      setIsLoading(false);
    }
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

                <Button
                  className="w-full cursor-pointer"
                  type="submit"
                  disabled={isLoading}
                >
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
};

export default Page;
