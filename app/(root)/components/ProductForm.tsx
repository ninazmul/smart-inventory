"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { FileUploader } from "@/components/shared/FileUploader";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { IProduct } from "@/lib/database/models/product.model";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/lib/actions/category.actions";

const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  mainImage: z.string().min(1, "Product image is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price is required"),
  wholesalePrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Stock is required"),
  minimumStockThreshold: z.coerce
    .number()
    .min(0, "Minimum stock threshold required"),
  isActive: z.boolean().default(true),
});

type ProductFormProps = {
  type: "Create" | "Update";
  product?: IProduct;
  tenantId: string;
};

const ProductForm = ({ type, product, tenantId }: ProductFormProps) => {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getAllCategories(tenantId);
      setCategories((cats ?? []).map((c) => c.name));
    };
    fetchCategories();
  }, [tenantId]);

  const initialValues =
    product && type === "Update"
      ? {
          title: product.title,
          mainImage: product.mainImage,
          category: product.category,
          price: product.price,
          wholesalePrice: product.wholesalePrice,
          stock: product.stock,
          minimumStockThreshold: product.minimumStockThreshold,
          isActive: product.isActive,
        }
      : {
          title: "",
          mainImage: "",
          category: "",
          price: 0,
          wholesalePrice: undefined,
          stock: 0,
          minimumStockThreshold: 1,
          isActive: true,
        };

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    try {
      const payload = { ...values };

      if (type === "Create") {
        const newProduct = await createProduct(tenantId, payload);
        if (newProduct) {
          form.reset();
          toast.success("Product created successfully!");
          router.push("/products");
        }
      } else if (type === "Update" && product?._id) {
        const updatedProduct = await updateProduct(
          tenantId,
          product._id.toString(),
          payload,
        );
        if (updatedProduct) {
          form.reset();
          toast.success("Product updated successfully!");
          router.push("/products");
        }
      }
    } catch {
      toast.error(
        `Failed to ${type === "Create" ? "create" : "update"} product. Please try again.`,
      );
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 rounded-lg border bg-white p-6 shadow-sm"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter product title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="mainImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Photo</FormLabel>
              <FormControl>
                <FileUploader
                  imageUrl={field.value}
                  setFiles={() => {}}
                  onFieldChange={(uploadedUrl) => field.onChange(uploadedUrl)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Wholesale Price */}
        <FormField
          control={form.control}
          name="wholesalePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wholesale Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Minimum Stock Threshold */}
        <FormField
          control={form.control}
          name="minimumStockThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Stock Threshold</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Toggle */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Active</FormLabel>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Product`}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
