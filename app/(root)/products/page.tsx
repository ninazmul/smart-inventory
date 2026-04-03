import { auth } from "@clerk/nextjs/server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductForm from "../components/ProductForm";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/actions/product.actions";
import ProductTable from "../components/ProductTable";

const Page = async () => {
  const { sessionClaims } = await auth();
  const tenantId = sessionClaims?.userId as string;

  const products = (await getAllProducts(tenantId)) || [];

  return (
    <>
      <section className="py-2 md:py-5">
        <div className="wrapper flex flex-wrap justify-between items-center">
          <h3 className="text-3xl font-bold text-center sm:text-left">
            All Products
          </h3>

          {/* Create Product Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full">
                Add Product
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-white max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill out this form to add a new product for your tenant. All
                  fields are required unless marked optional.
                </DialogDescription>
              </DialogHeader>

              <div className="py-5">
                <ProductForm type="Create" tenantId={tenantId} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <div className="wrapper my-8">
        <ProductTable tenantId={tenantId} products={products} />
      </div>
    </>
  );
};

export default Page;
