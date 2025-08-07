"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/entity/category";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const Page = () => {
  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories(),
  });

  const { session, logout } = useAuth();

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        {session && (
          <Button onClick={logout} className="ml-4">
            Logout
          </Button>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Categories:</h2>
        {categoriesResponse?.data && categoriesResponse.data.length > 0 ? (
          <ul className="list-disc pl-6">
            {categoriesResponse.data.map((category: Category) => (
              <li key={category.id} className="py-1">
                {category.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories found</p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Session Status:</h3>
        {session ? (
          <div className="text-green-600">
            ✅ Logged in as: {session.user?.email || "User"}
          </div>
        ) : (
          <div className="text-red-600">❌ Not logged in</div>
        )}
      </div>
    </div>
  );
};

export default Page;
