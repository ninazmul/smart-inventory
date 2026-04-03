"use client";

import { IProduct } from "@/lib/database/models/product.model";
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
import Image from "next/image";
import { deleteProduct } from "@/lib/actions/product.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import { useState } from "react";

type ProductTableProps = {
  products: IProduct[];
  tenantId: string;
};

const ProductTable = ({ products, tenantId }: ProductTableProps) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // products per page
  const totalPages = Math.ceil(products.length / pageSize);

  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId, tenantId);
      toast.success("Product deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-6">
      <Table className="border rounded-lg shadow-sm">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Wholesale Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow
              key={product._id.toString()}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                {product.mainImage ? (
                  <Image
                    src={product.mainImage}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="rounded object-cover border"
                  />
                ) : (
                  <span className="text-gray-400 italic">No Image</span>
                )}
              </TableCell>

              <TableCell className="font-medium text-gray-900">
                {product.title}
              </TableCell>
              <TableCell className="text-gray-700">
                {product.category}
              </TableCell>
              <TableCell className="font-semibold">
                ${product.price.toFixed(2)}
              </TableCell>
              <TableCell>
                {product.wholesalePrice ? (
                  `$${product.wholesalePrice.toFixed(2)}`
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.minimumStockThreshold}</TableCell>

              <TableCell>
                {product.isActive ? (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                    Inactive
                  </span>
                )}
              </TableCell>

              <TableCell className="flex justify-end gap-2">
                {/* Edit Dialog */}
                <Dialog
                  open={selectedProduct?._id === product._id}
                  onOpenChange={(open) => !open && setSelectedProduct(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Update Product</DialogTitle>
                      <DialogDescription>
                        Update the product details below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-5">
                      {selectedProduct && (
                        <ProductForm
                          type="Update"
                          product={selectedProduct}
                          tenantId={tenantId}
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product._id.toString())}
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

export default ProductTable;
