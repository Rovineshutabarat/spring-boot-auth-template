"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod/v3";
import { LoginRequest } from "@/types/payload/request/login.request";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/payload/response/common/error.response";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

type LoginRequest = z.infer<typeof LoginRequest>;
const LoginPage = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationKey: ["login_mutation"],
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (data) => {
      toast.success(data?.message);
      router.push("/");
    },
    onError: (error: any) => {
      const parsed = error.parsedBody as ErrorResponse;
      toast.error(parsed.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginRequest),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<LoginRequest> = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5 md:px-0">
      <div className="flex w-full items-center justify-center px-4 py-12 md:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                  <Link
                    href="#"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
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
                    className="absolute top-0 right-0 cursor-pointer"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    {isShowPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-destructive text-sm">
                    *{errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>

              <Button
                className="w-full cursor-pointer"
                type="submit"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Please wait..." : "Sign in"}
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
              className="w-full bg-primary/10 shadow-sm shadow-primary/50 dark:shadow-none cursor-pointer"
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
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-500 hover:underline"
              >
                Sign up
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

export default LoginPage;
