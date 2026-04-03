"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import toast from "react-hot-toast";

interface CategoryFormProps {
  tenantId: string;
  type?: "Create" | "Update";
  defaultValues?: Partial<ICategory>;
  onSuccess?: () => void;
}

const schema = z.object({
  name: z.string().min(2, "Category name is required"),
});

type FormValues = z.infer<typeof schema>;

const CategoryForm: React.FC<CategoryFormProps> = ({
  tenantId,
  type = "Create",
  defaultValues,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { name: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await createCategory(tenantId, data);
      toast.success(
        `Category ${type === "Create" ? "created" : "updated"} successfully`,
      );
      reset();
      onSuccess?.();
    } catch {
      toast.error(`Failed to ${type.toLowerCase()} category`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          placeholder="Enter category name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : type}
      </Button>
    </form>
  );
};

export default CategoryForm;
