import { auth } from "@clerk/nextjs/server";
import { getAllOrders } from "@/lib/actions/order.actions";
import { getAllProducts } from "@/lib/actions/product.actions";
import { getAllCustomers } from "@/lib/actions/customer.actions";
import DashboardClient from "./components/DashboardClient";

const DashboardPage = async () => {
  const { sessionClaims } = await auth();
  const tenantId = sessionClaims?.userId as string;

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
