"use client";

import React, { useState } from "react";
import { ICategory } from "@/lib/database/models/category.model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/actions/category.actions";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";

interface CategoryTableProps {
  tenantId: string;
  categories: ICategory[];
  onDeleted?: () => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  tenantId,
  categories,
  onDeleted,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // categories per page
  const totalPages = Math.ceil(categories.length / pageSize);

  const paginatedCategories = categories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(tenantId, id);
      toast.success("Category deleted successfully");
      onDeleted?.();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <p className="text-center text-gray-500 italic">No categories found.</p>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <Table className="border rounded-lg shadow-sm">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCategories.map((cat) => (
            <TableRow
              key={cat._id.toString()}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium text-gray-900">
                {cat.name}
              </TableCell>
              <TableCell className="flex justify-end">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(cat._id.toString())}
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

export default CategoryTable;
