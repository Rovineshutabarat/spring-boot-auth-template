"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const RegisterPage = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);

  const { signUp, isSigningUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterRequest),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<RegisterRequest> = (data: RegisterRequest) => {
    signUp(data);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5 md:px-0">
      <div className="flex w-full items-center justify-center px-4 py-8 md:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your information to create your account
            </p>
          </div>

          <div className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter Your Username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="mt-1 text-destructive text-sm">
                    *{errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter Your Email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-destructive text-sm">
                    *{errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={isShowPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter Your Password"
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
                    autoComplete="new-password"
                    placeholder="Confirm Your Password"
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
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <div className="flex items-center space-x-2">
                    <div
                      className="inline-block h-4 w-4 animate-spin rounded-full border-3 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_0.4s_linear_infinite] dark:text-slate-700"
                      role="status"
                    ></div>
                    <p>Please wait...</p>
                  </div>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-500 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden bg-primary/10 lg:block md:w-1/2">
        <div className="flex h-full items-center justify-center">
          <div className="relative h-full w-full max-w-3xl">
            <img
              src="https://www.gbscorporate.com/uploads/pexels-olia-danilevich-4974914.jpg"
              alt="Login illustration"
              className="h-screen w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
