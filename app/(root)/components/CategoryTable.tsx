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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setDeletingId(id);
    try {
      await deleteCategory(tenantId, id);
      toast.success("Category deleted successfully");
      onDeleted?.();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  if (!categories || categories.length === 0) {
    return <p className="text-center text-gray-500">No categories found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((cat) => (
          <TableRow key={cat._id.toString()}>
            <TableCell>{cat.name}</TableCell>
            <TableCell>
              {new Date(cat.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(cat._id.toString())}
                disabled={deletingId === cat._id.toString()}
              >
                {deletingId === cat._id.toString() ? "Deleting..." : "Delete"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
