"use client";

import AuthGuard from "@/components/ui/auth-guard";
import { CategoryService } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";

export default function page() {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories(),
  });

  return (
    <AuthGuard roles={["ROLE_USER"]}>
      <div>
        {data?.data.map((category) => (
          <div key={category.id}>{category.name}</div>
        ))}
      </div>
    </AuthGuard>
  );
}
