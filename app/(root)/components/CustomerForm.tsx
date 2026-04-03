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
import * as z from "zod";
import { createCustomer, updateCustomer } from "@/lib/actions/customer.actions";
import { ICustomer } from "@/lib/database/models/customer.model";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(5, "Phone is required"),
  address: z.string().optional(),
  city: z.string().optional(),
});

type CustomerFormProps = {
  type: "Create" | "Update";
  tenantId: string;
  customer?: ICustomer;
};

const CustomerForm = ({ type, tenantId, customer }: CustomerFormProps) => {
  const router = useRouter();

  const initialValues =
    customer && type === "Update"
      ? {
          name: customer.name,
          email: customer.email || "",
          phone: customer.phone,
          address: customer.address || "",
          city: customer.city || "",
        }
      : {
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
        };

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: z.infer<typeof customerFormSchema>) => {
    try {
      if (type === "Create") {
        await createCustomer(tenantId, values);
        toast.success("Customer created successfully!");
        form.reset();
        router.refresh();
      } else if (type === "Update" && customer?._id) {
        await updateCustomer(tenantId, customer._id.toString(), values);
        toast.success("Customer updated successfully!");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 rounded-lg border bg-white p-6 shadow-sm"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input
                  placeholder="Enter full name"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input
                  placeholder="Enter email (optional)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <input
                  placeholder="Enter phone number"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <input
                  placeholder="Enter address (optional)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <input
                  placeholder="Enter city (optional)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
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
          {form.formState.isSubmitting ? "Submitting..." : `${type} Customer`}
        </Button>
      </form>
    </Form>
  );
};

export default CustomerForm;
