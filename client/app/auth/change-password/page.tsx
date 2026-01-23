"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const Page = () => {
  const [isShowPassword, setIsShowPassword] = React.useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    React.useState<boolean>(false);

  const router = useRouter();

  const { isLoading, changePassword } = useAuth();

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
              <h1 className="text-3xl font-bold">Reset your password</h1>
              <p className="text-sm text-muted-foreground">
                Please enter and confirm your new password below.
              </p>
            </div>

            <div className="space-y-6">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">New Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={isShowPassword ? "text" : "password"}
                      placeholder="Enter Your New Password"
                      {...register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-0 right-0"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    >
                      {isShowPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-destructive text-sm">
                      *{errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={isShowConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Your New Password"
                      {...register("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-0 right-0 cursor-pointer"
                      onClick={() =>
                        setIsShowConfirmPassword(!isShowConfirmPassword)
                      }
                    >
                      {isShowConfirmPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-destructive text-sm">
                      *{errors.confirmPassword.message}
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
