import { auth } from "@clerk/nextjs/server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CategoryForm from "../components/CategoryForm";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/actions/category.actions";
import CategoryTable from "../components/CategoryTable";
import { ICategory } from "@/lib/database/models/category.model";

const Page = async () => {
  const { sessionClaims } = await auth();
  const tenantId = sessionClaims?.userId as string;

  const categories: ICategory[] = (await getAllCategories(tenantId)) || [];

  return (
    <>
      <section className="py-2 md:py-5">
        <div className="wrapper flex flex-wrap justify-between items-center">
          <h3 className="text-3xl font-bold text-center sm:text-left">
            All Categories
          </h3>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full">
                Create Category
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Use this form to create a new category for your tenant. Fill
                  out all required fields accurately to ensure proper setup.
                </DialogDescription>
              </DialogHeader>

              <div className="py-5">
                <CategoryForm tenantId={tenantId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <div className="wrapper my-8">
        <CategoryTable tenantId={tenantId} categories={categories} />
      </div>
    </>
  );
};

export default Page;
