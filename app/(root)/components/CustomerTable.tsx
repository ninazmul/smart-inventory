"use client";

import { ICustomer } from "@/lib/database/models/customer.model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import CustomerForm from "./CustomerForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCustomer } from "@/lib/actions/customer.actions";

type CustomerTableProps = {
  customers: ICustomer[];
  tenantId: string;
};

const CustomerTable = ({ customers, tenantId }: CustomerTableProps) => {
  const router = useRouter();

  const handleDelete = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await deleteCustomer(tenantId, customerId);
      toast.success("Customer deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete customer");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>City</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer._id.toString()}>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.email || "-"}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>{customer.address || "-"}</TableCell>
            <TableCell>{customer.city || "-"}</TableCell>
            <TableCell className="flex justify-end gap-2">
              {/* Edit Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Pencil size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Customer</DialogTitle>
                  </DialogHeader>
                  <div className="py-5">
                    <CustomerForm
                      type="Update"
                      tenantId={tenantId}
                      customer={customer}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete */}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(customer._id.toString())}
              >
                <Trash size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomerTable;
