"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="flex justify-center items-center">
          <AlertCircle className="text-red-700" size={40} />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Access Denied
        </h1>
        <p className="mt-4 text-muted-foreground">
          Sorry, you don’t have the necessary permissions to view this page.
          Please contact the administrator if you believe this is an error.
        </p>
        <div className="flex flex-col gap-y-2 mt-6 items-center">
          <Button
            className="w-full cursor-pointer"
            onClick={() => router.push("/")}
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
