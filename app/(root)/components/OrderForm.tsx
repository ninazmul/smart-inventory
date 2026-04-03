"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { IProduct } from "@/lib/database/models/product.model";
import { ICustomer } from "@/lib/database/models/customer.model";
import { createOrder, updateOrder } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import ProductPicker from "./ProductPicker";
import { PlainOrder } from "@/lib/utils";

// ---------------- Zod Schema ----------------
const orderFormSchema = z.object({
  customerId: z.string().optional(),
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email().optional(),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  products: z
    .array(
      z.object({
        productId: z.string(),
        title: z.string(),
        unitPrice: z.number(),
        quantity: z.number().min(1),
        image: z.string(),
      }),
    )
    .min(1, "Select at least one product"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

type OrderFormProps = {
  tenantId: string;
  customers: ICustomer[];
  products: IProduct[];
  type: "Create" | "Update";
  order?: PlainOrder;
};

const OrderForm = ({
  tenantId,
  customers,
  products,
  type,
  order,
}: OrderFormProps) => {
  const router = useRouter();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: order
      ? {
          customerId: undefined,
          name: order.name,
          email: order.email || "",
          phone: order.phone,
          address: order.address,
          city: order.city || "",
          notes: order.notes || "",
          status: order.status,
          products: order.products.map((p) => ({
            productId: p.productId.toString(),
            title: p.title,
            unitPrice: p.unitPrice,
            quantity: p.quantity,
            image: p.image,
          })),
        }
      : {
          customerId: undefined,
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          notes: "",
          status: "pending",
          products: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const onSubmit = async (values: OrderFormValues) => {
    try {
      const payload = { ...values };
      if (type === "Update" && order?._id) {
        await updateOrder(tenantId, order._id.toString(), payload);
        toast.success("Order updated successfully!");
      } else {
        await createOrder(tenantId, payload);
        toast.success("Order created successfully!");
      }
      router.refresh();
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit order");
    }
  };

  const handleAddProduct = (product: IProduct) => {
    if (!fields.find((f) => f.productId === product._id.toString())) {
      append({
        productId: product._id.toString(),
        title: product.title,
        unitPrice: product.price,
        quantity: 1,
        image: product.mainImage || "",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Existing Customer */}
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Existing Customer</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    const c = customers.find((c) => c._id.toString() === val);
                    if (c) {
                      form.setValue("name", c.name);
                      form.setValue("email", c.email || "");
                      form.setValue("phone", c.phone);
                      form.setValue("address", c.address || "");
                      form.setValue("city", c.city || "");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer (or leave blank)" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem
                        key={c._id.toString()}
                        value={c._id.toString()}
                      >
                        {c.name} ({c.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Customer Info */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Order Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "pending",
                      "confirmed",
                      "shipped",
                      "delivered",
                      "cancelled",
                    ].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product selection */}
        <div className="mt-4">
          <ProductPicker
            products={products}
            onAdd={handleAddProduct}
            maxVisible={10}
          />
        </div>

        {/* Selected Products */}
        <div className="mt-4">
          <p className="font-semibold mb-2">Selected Products</p>
          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-center mb-2">
              <Image
                src={item.image}
                alt={item.title}
                width={40}
                height={40}
                className="w-10 h-10 rounded"
              />
              <span className="flex-1">{item.title}</span>

              {/* Controlled quantity input */}
              <Controller
                control={form.control}
                name={`products.${index}.quantity`}
                render={({ field }) => (
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-20"
                  />
                )}
              />

              <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 font-bold">
          Total: $
          {fields
            .reduce((sum, f) => sum + f.unitPrice * f.quantity, 0)
            .toFixed(2)}
        </div>

        <Button type="submit" size="lg" className="mt-4">
          {type === "Update" ? "Update Order" : "Create Order"}
        </Button>
      </form>
    </Form>
  );
};

export default OrderForm;
