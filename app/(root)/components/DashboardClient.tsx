"use client";

import { IOrder } from "@/lib/database/models/order.model";
import { IProduct } from "@/lib/database/models/product.model";
import { ICustomer } from "@/lib/database/models/customer.model";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RecentActivity from "./RecentActivity";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

type DashboardClientProps = {
  tenantId: string;
  orders: IOrder[];
  products: IProduct[];
  customers: ICustomer[];
};

const LOW_STOCK_THRESHOLD = 5;

const DashboardClient = ({
  tenantId,
  orders,
  products,
  customers,
}: DashboardClientProps) => {
  const today = new Date();

  // ---------------- Metrics ----------------
  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today.toDateString(),
  );
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  const revenueToday = ordersToday.reduce((sum, o) => sum + o.totalPrice, 0);
  const lowStockItems = products.filter(
    (p) => p.stock <= LOW_STOCK_THRESHOLD,
  ).length;

  // ---------------- Product Summary ----------------
  const productSummary = products.map((p) => ({
    product: p,
    status: p.stock <= LOW_STOCK_THRESHOLD ? "Low Stock" : "OK",
  }));

  // ---------------- Top Selling Products ----------------
  const productSalesMap: Record<string, number> = {};
  orders.forEach((order) => {
    order.products.forEach((p) => {
      productSalesMap[p.productId.toString()] =
        (productSalesMap[p.productId.toString()] || 0) + p.quantity;
    });
  });
  const topProducts = products
    .map((p) => ({ ...p, sold: productSalesMap[p._id.toString()] || 0 }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // ---------------- Top Customers ----------------
  const customerRevenueMap: Record<string, number> = {};
  orders.forEach((o) => {
    const cid = o.email || o.phone || o.name;
    customerRevenueMap[cid] = (customerRevenueMap[cid] || 0) + o.totalPrice;
  });
  const topCustomers = customers
    .map((c) => ({
      ...c,
      totalSpent: customerRevenueMap[c.email || c.phone || c.name] || 0,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  // ---------------- Pie Chart Data ----------------
  const pieData = [
    { name: "Pending", value: pendingOrders },
    { name: "Completed", value: completedOrders },
  ];
  const COLORS = ["#facc15", "#4ade80"];

  return (
    <div className="wrapper py-5 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Inventory & Sales Dashboard</h1>

      {/* ---------- Key Metrics ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Orders Today</p>
          <h2 className="text-2xl font-bold">{ordersToday.length}</h2>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Pending vs Completed Orders</p>
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={20}
                outerRadius={40}
                paddingAngle={5}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <h2 className="text-2xl font-bold">{lowStockItems}</h2>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Revenue Today</p>
          <h2 className="text-2xl font-bold">${revenueToday.toFixed(2)}</h2>
        </Card>
      </div>

      {/* ---------- Product Summary ---------- */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Product Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productSummary.map(({ product, status }) => (
            <Card
              key={product._id.toString()}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{product.title}</p>
                <p className="text-sm text-gray-500">{product.stock} left</p>
              </div>
              <Badge
                variant={status === "Low Stock" ? "destructive" : "default"}
                className="py-1 px-3"
              >
                {status}
              </Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* ---------- Top Selling Products ---------- */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Top Selling Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topProducts.map((p) => (
            <Card
              key={p._id.toString()}
              className="p-4 flex justify-between items-center"
            >
              <p>{p.title}</p>
              <Badge variant="secondary">{p.sold} sold</Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* ---------- Top Customers ---------- */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Top Customers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCustomers.map((c) => (
            <Card
              key={c._id.toString()}
              className="p-4 flex justify-between items-center"
            >
              <p>{c.name}</p>
              <Badge variant="secondary">${c.totalSpent.toFixed(2)}</Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* ---------- Stock Level Bar Chart ---------- */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Stock Levels</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={products.map((p) => ({ name: p.title, stock: p.stock }))}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-30}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" fill="#3b82f6">
              {products.map((p, idx) => (
                <Cell
                  key={idx}
                  fill={p.stock <= LOW_STOCK_THRESHOLD ? "#f87171" : "#34d399"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ---------- Recent Activity ---------- */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <RecentActivity tenantId={tenantId} />
      </div>
    </div>
  );
};

export default DashboardClient;
