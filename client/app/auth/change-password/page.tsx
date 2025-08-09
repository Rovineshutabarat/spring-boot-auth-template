"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod/v3";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

type UpdatePasswordRequest = z.infer<typeof UpdatePasswordRequest>;
const Page = () => {
  const [isShowOldPassword, setIsShowOldPassword] =
    React.useState<boolean>(false);
  const [isShowNewPassword, setIsShowNewPassword] =
    React.useState<boolean>(false);
  const { isLoading, changePassword } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdatePasswordRequest),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    const sessionEmail = sessionStorage.getItem("verification_email");
    if (!sessionEmail) {
      router.back();
    } else {
      setValue("email", sessionEmail);
    }
  }, []);

  const onSubmit: SubmitHandler<UpdatePasswordRequest> = (
    data: UpdatePasswordRequest,
  ) => {
    changePassword(data);
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Old Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={isShowOldPassword ? "text" : "password"}
                      placeholder="Enter Your Old Password"
                      {...register("oldPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-0 right-0"
                      onClick={() => setIsShowOldPassword(!isShowOldPassword)}
                    >
                      {isShowOldPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {errors.oldPassword && (
                    <p className="mt-1 text-destructive text-sm">
                      *{errors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confirm_password">New Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={isShowNewPassword ? "text" : "password"}
                      placeholder="Confirm Your Password"
                      {...register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-0 right-0 cursor-pointer"
                      onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                    >
                      {isShowNewPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-destructive text-sm">
                      *{errors.password.message}
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
