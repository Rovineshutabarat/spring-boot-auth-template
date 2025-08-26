"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const { session } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateProfileRequest),
    mode: "onBlur",
  });

  const updateProfileMutation = useMutation({
    mutationKey: ["update_profile_mutation"],
    mutationFn: (data: UpdateProfileRequest) =>
      UserService.updateUser(session?.user.id, data),
    onSuccess: () => toast.success("Success Updating Profile"),
    onError: () => toast.error("Fail to update profile"),
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
              <AvatarImage src="" />
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
                  defaultValue={session?.user.username}
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
                  value={session?.user.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-destructive text-sm">
                    *{errors.email.message}
                  </p>
                )}
              </div>

              <Button className="w-full" type="submit">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
