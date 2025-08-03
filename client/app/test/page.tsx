"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/entity/category";
import { useAuth } from "@/hooks/use-auth";

const Page = () => {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories(),
  });

  const { session } = useAuth();
  return (
    <div>
      {session ? (
        <>
          {data?.data.map((data: Category) => {
            return <p key={data.id}>{data.name}</p>;
          })}
        </>
      ) : (
        <p>Kontl</p>
      )}
    </div>
  );
};

export default Page;
