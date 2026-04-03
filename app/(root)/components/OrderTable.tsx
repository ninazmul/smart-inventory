"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
import OrderForm from "./OrderForm";
import RestockQueue from "./RestockQueue";
import { deleteOrder } from "@/lib/actions";
import { IOrder, IOrderProduct } from "@/lib/database/models/order.model";
import { IProduct } from "@/lib/database/models/product.model";
import { ICustomer } from "@/lib/database/models/customer.model";

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // number of orders per page
  const totalPages = Math.ceil(orders.length / pageSize);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
      <Table className="border rounded-lg shadow-sm">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order) => (
            <TableRow
              key={order._id.toString()}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium">{order.name}</TableCell>

              {/* Products */}

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Products ({order.products.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    {order.products.map((p: IOrderProduct) => (
                      <DropdownMenuItem
                        key={p.productId.toString()}
                        className="flex items-center gap-2"
                      >
                        {p.image && (
                          <Image
                            src={p.image}
                            alt={p.title}
                            width={30}
                            height={30}
                            className="rounded object-cover border"
                          />
                        )}
                        <span className="text-sm text-gray-700">
                          {p.title} × {p.quantity}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

              <TableCell className="font-semibold">
                ${order.totalPrice.toFixed(2)}
              </TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === "pending"
                      ? "bg-gray-200 text-gray-700"
                      : order.status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "shipped"
                          ? "bg-orange-100 text-orange-700"
                          : order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </TableCell>

              {/* Actions */}
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {/* Restock Queue */}
      <RestockQueue tenantId={tenantId} products={products} />
    </div>
  );
};

export default OrderTable;
