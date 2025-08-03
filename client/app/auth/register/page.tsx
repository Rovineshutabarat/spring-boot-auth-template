"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod/v3";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";

type RegisterRequest = z.infer<typeof RegisterRequest>;
const RegisterPage = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const { signUp, isLoading } = useAuth();

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
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Sign up"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full bg-primary/10 shadow-sm shadow-primary/50 dark:shadow-none"
              type="button"
            >
              <Image
                src="https://img.icons8.com/fluency/50/google-logo.png"
                alt="google icon"
                height={20}
                width={20}
              />
              <span>Google</span>
            </Button>

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
            <Image
              src="https://edma-theme.vercel.app/images/signup-img.jpg"
              alt="Login illustration"
              width={600}
              height={600}
              className="h-screen w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
