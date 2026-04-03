import { auth } from "@clerk/nextjs/server";
import { getAllOrders } from "@/lib/actions/order.actions";
import { getAllProducts } from "@/lib/actions/product.actions";
import { getAllCustomers } from "@/lib/actions/customer.actions";
import DashboardClient from "./components/DashboardClient";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const tenantId = userId;

  const [orders, products, customers] = await Promise.all([
    getAllOrders(tenantId),
    getAllProducts(tenantId),
    getAllCustomers(tenantId),
  ]);

  return (
    <DashboardClient
      tenantId={tenantId}
      orders={orders || []}
      products={products || []}
      customers={customers || []}
    />
  );
};

export default DashboardPage;
