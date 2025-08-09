import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <div className="flex justify-center items-center">
          <AlertCircle className="text-red-500" size={40} />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unauthorized Access
        </h1>
        <p className="mt-2 text-muted-foreground">
          You do not have permission to access this content. Please sign in to
          continue.
        </p>
        <div className="flex flex-col gap-y-4 mt-7 items-center">
          <Link href="/" className="w-full">
            <Button className="w-full cursor-pointer">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
