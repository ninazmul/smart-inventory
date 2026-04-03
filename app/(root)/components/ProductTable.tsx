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
    <>
      <Table>
        <TableHeader>
          <TableRow>
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
          {products.map((product) => (
            <TableRow key={product._id.toString()}>
              <TableCell>
                {product.mainImage ? (
                  <Image
                    src={product.mainImage}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="rounded object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                {product.wholesalePrice
                  ? `$${product.wholesalePrice.toFixed(2)}`
                  : "-"}
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.minimumStockThreshold}</TableCell>
              <TableCell>
                {product.isActive ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                {/* Edit Dialog */}
                <Dialog>
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
    </>
  );
};

export default ProductTable;
