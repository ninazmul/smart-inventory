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
import { useState } from "react";

type CustomerTableProps = {
  customers: ICustomer[];
  tenantId: string;
};

const CustomerTable = ({ customers, tenantId }: CustomerTableProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // customers per page
  const totalPages = Math.ceil(customers.length / pageSize);

  const paginatedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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

  if (!customers || customers.length === 0) {
    return (
      <p className="text-center text-gray-500 italic">No customers found.</p>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <Table className="border rounded-lg shadow-sm">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCustomers.map((customer) => (
            <TableRow
              key={customer._id.toString()}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium text-gray-900">
                {customer.name}
              </TableCell>
              <TableCell>
                {customer.email ? (
                  customer.email
                ) : (
                  <span className="text-gray-400 italic">No Email</span>
                )}
              </TableCell>
              <TableCell>
                {customer.phone || <span className="text-gray-400">-</span>}
              </TableCell>
              <TableCell>
                {customer.address || <span className="text-gray-400">-</span>}
              </TableCell>
              <TableCell>
                {customer.city || <span className="text-gray-400">-</span>}
              </TableCell>

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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
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
    </div>
  );
};

export default CustomerTable;
