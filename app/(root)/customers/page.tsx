import { auth } from "@clerk/nextjs/server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAllCustomers } from "@/lib/actions/customer.actions";
import { ICustomer } from "@/lib/database/models/customer.model";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";

const Page = async () => {
  const { sessionClaims } = await auth();
  const tenantId = sessionClaims?.userId as string;

  const customers: ICustomer[] = (await getAllCustomers(tenantId)) || [];

  return (
    <>
      {/* Header Section */}
      <section className="py-2 md:py-5">
        <div className="wrapper flex flex-wrap justify-between items-center">
          <h3 className="text-3xl font-bold text-center sm:text-left">
            All Customers
          </h3>

          {/* Create Customer Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full">
                Add Customer
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-white max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Fill out all required fields to create a new customer for your
                  tenant.
                </DialogDescription>
              </DialogHeader>

              <div className="py-5">
                <CustomerForm tenantId={tenantId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Customer Table */}
      <div className="wrapper my-8">
        <CustomerTable tenantId={tenantId} customers={customers} />
      </div>
    </>
  );
};

export default Page;
