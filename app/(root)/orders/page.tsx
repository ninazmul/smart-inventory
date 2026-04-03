import { auth } from "@clerk/nextjs/server";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OrderForm from "../components/OrderForm";
import { Button } from "@/components/ui/button";
import { getAllOrders } from "@/lib/actions/order.actions";
import OrderTable from "../components/OrderTable";
import { getAllCustomers, getAllProducts } from "@/lib/actions";
import { ICustomer } from "@/lib/database/models/customer.model";
import { redirect } from "next/navigation";
import { PlainOrder } from "@/lib/utils";

const Page = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const tenantId = userId;

  const orders: PlainOrder[] = (await getAllOrders(tenantId)) || [];
  const products = (await getAllProducts(tenantId)) || [];
  const customers: ICustomer[] = (await getAllCustomers(tenantId)) || [];

  return (
    <>
      <section className="py-2 md:py-5">
        <div className="wrapper flex flex-wrap justify-between items-center">
          <h3 className="text-3xl font-bold text-center sm:text-left">
            All Orders
          </h3>

          {/* Create Order Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full">
                Create Order
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-white max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Fill out this form to create a new order for your tenant. All
                  fields are required unless marked optional.
                </p>
              </DialogHeader>

              <div className="py-5">
                <OrderForm
                  type="Create"
                  tenantId={tenantId}
                  products={products}
                  customers={customers}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <div className="wrapper my-8">
        <OrderTable
          tenantId={tenantId}
          orders={orders}
          products={products}
          customers={customers}
        />
      </div>
    </>
  );
};

export default Page;
