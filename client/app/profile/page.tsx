"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import AuthGuard from "@/components/ui/auth-guard";
import { SubmitHandler, useForm } from "react-hook-form";
import { UpdateProfileRequest } from "@/types/payload/request/update.profile.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/services/user.service";
import { toast } from "sonner";
import React from "react";

export default function ProfilePage() {
  const { session, isRefreshLoading } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateProfileRequest),
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (session?.user) {
      reset({
        username: session.user.username,
        email: session.user.email,
      });
    }
  }, [session, reset]);

  const updateProfileMutation = useMutation({
    mutationKey: ["update_profile_mutation"],
    mutationFn: (data: UpdateProfileRequest) => {
      const id = session?.user.id;
      if (!id) throw new Error("Session is not ready.");
      return UserService.updateUser(id, data);
    },
    onSuccess: () => toast.success("Profile updated successfully."),
    onError: () => toast.error("Failed to update profile."),
  });

  const onSubmit: SubmitHandler<UpdateProfileRequest> = (
    data: UpdateProfileRequest,
  ) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <AuthGuard roles={["ROLE_USER"]}>
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarFallback className="uppercase text-4xl font-semibold">
                {session?.user.username.at(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">My Profile</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
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

              <Button
                className="w-full"
                type="submit"
                disabled={
                  isRefreshLoading ||
                  !session ||
                  updateProfileMutation.isPending
                }
              >
                {updateProfileMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div
                      className="inline-block h-4 w-4 animate-spin rounded-full border-3 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_0.4s_linear_infinite] dark:text-slate-700"
                      role="status"
                    ></div>
                    <p>Please wait...</p>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
