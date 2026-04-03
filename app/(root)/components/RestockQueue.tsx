"use client";

import { IProduct } from "@/lib/database/models/product.model";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateProduct } from "@/lib/actions/product.actions";

type RestockQueueProps = {
  tenantId: string;
  products: IProduct[];
};

const RestockQueue = ({ tenantId, products }: RestockQueueProps) => {
  const router = useRouter();

  // Filter low stock products
  const lowStockProducts = products
    .filter((p) => p.stock <= p.minimumStockThreshold)
    .sort((a, b) => a.stock - b.stock);

  const getPriority = (product: IProduct) => {
    const ratio = product.stock / product.minimumStockThreshold;
    if (ratio <= 0.2) return "High";
    if (ratio <= 0.5) return "Medium";
    return "Low";
  };

  const handleRestock = async (productId: string, amount: number) => {
    try {
      await updateProduct(productId, tenantId, { stock: amount });
      toast.success("Stock updated successfully");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stock");
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await updateProduct(productId, tenantId, { stock: 0 });
      toast.success("Product removed from restock queue");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove product");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Restock Queue</h3>

      {lowStockProducts.length === 0 ? (
        <p className="text-gray-500 italic">No low stock products 🎉</p>
      ) : (
        <div className="flex flex-col gap-3">
          {lowStockProducts.map((p) => {
            const priority = getPriority(p);
            return (
              <div
                key={p._id.toString()}
                className="flex items-center justify-between bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product Info */}
                <div>
                  <p className="font-semibold text-gray-900">{p.title}</p>
                  <p className="text-sm text-gray-600">
                    Stock: <span className="font-medium">{p.stock}</span> /{" "}
                    {p.minimumStockThreshold}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                      priority === "High"
                        ? "bg-red-100 text-red-700"
                        : priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    Priority: {priority}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleRestock(
                        p._id.toString(),
                        p.minimumStockThreshold * 2,
                      )
                    }
                  >
                    Restock
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemove(p._id.toString())}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestockQueue;
