"use client";

import { useState } from "react";
import { IOrder, IOrderProduct } from "@/lib/database/models/order.model";
import { IProduct } from "@/lib/database/models/product.model";
import { ICustomer } from "@/lib/database/models/customer.model";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import OrderForm from "./OrderForm"; // update order + status
import RestockQueue from "./RestockQueue"; // restock queue component
import { deleteOrder } from "@/lib/actions";

type OrderTableProps = {
  orders: IOrder[];
  products: IProduct[];
  customers: ICustomer[];
  tenantId: string;
};

const OrderTable = ({
  orders,
  products,
  customers,
  tenantId,
}: OrderTableProps) => {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const handleDelete = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await deleteOrder(tenantId, orderId);
      if (!res) throw new Error("Failed to delete");
      toast.success("Order deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Orders Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id.toString()}>
              <TableCell>{order.name}</TableCell>

              {/* Products with images */}
              <TableCell className="flex flex-wrap gap-2">
                {order.products.map((p: IOrderProduct) => (
                  <div
                    key={p.productId.toString()}
                    className="flex items-center gap-1"
                  >
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.title}
                        width={30}
                        height={30}
                        className="rounded object-cover"
                      />
                    )}
                    <span>
                      {p.title} x {p.quantity}
                    </span>
                  </div>
                ))}
              </TableCell>

              <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`font-medium ${
                    order.status === "pending"
                      ? "text-gray-600"
                      : order.status === "confirmed"
                        ? "text-blue-600"
                        : order.status === "shipped"
                          ? "text-orange-600"
                          : order.status === "delivered"
                            ? "text-green-600"
                            : "text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </TableCell>

              {/* Actions: Edit/Delete */}
              <TableCell className="flex justify-end gap-2">
                <Dialog
                  open={selectedOrder?._id === order._id}
                  onOpenChange={(open) => !open && setSelectedOrder(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="bg-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Update Order</DialogTitle>
                      <DialogDescription>
                        Update status, products, quantities, or customer
                        details.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-5">
                      {selectedOrder && (
                        <OrderForm
                          type="Update"
                          order={selectedOrder}
                          products={products}
                          customers={customers}
                          tenantId={tenantId}
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(order._id.toString())}
                >
                  <Trash size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Restock Queue */}
      <RestockQueue tenantId={tenantId} products={products} />
    </div>
  );
};

export default OrderTable;
