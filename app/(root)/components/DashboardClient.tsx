"use client";

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
  Legend,
} from "recharts";
import { PlainOrder } from "@/lib/utils";

type DashboardClientProps = {
  tenantId: string;
  orders: PlainOrder[];
  products: IProduct[];
  customers: ICustomer[];
};

const LOW_STOCK_THRESHOLD = 5;
const COLOR_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f472b6",
  "#60a5fa",
  "#34d399",
  "#f97316",
];

const truncate = (s: string, n = 18) =>
  s.length > n ? `${s.slice(0, n - 1)}…` : s;

export default function DashboardClient({
  tenantId,
  orders,
  products,
  customers,
}: DashboardClientProps) {
  const today = new Date();

  // ---------- Metrics ----------
  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today.toDateString(),
  );
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  const revenueToday = ordersToday.reduce((sum, o) => sum + o.totalPrice, 0);
  const lowStockItems = products.filter(
    (p) => p.stock <= LOW_STOCK_THRESHOLD,
  ).length;

  // ---------- Profit Today ----------
  let profitToday = 0;
  ordersToday.forEach((order) =>
    order.products.forEach((op) => {
      const prod = products.find(
        (p) => p._id.toString() === op.productId.toString(),
      );
      if (prod) {
        const unitProfit = prod.price - (prod.wholesalePrice || 0);
        profitToday += unitProfit * op.quantity;
      }
    }),
  );

  // ---------- Product summary ----------
  const productSummary = products.map((p) => ({
    product: p,
    status: p.stock <= LOW_STOCK_THRESHOLD ? "Low Stock" : "OK",
  }));

  // ---------- Sales & Profit maps ----------
  const productSalesMap: Record<string, number> = {};
  const productProfitMap: Record<string, number> = {};

  orders.forEach((order) =>
    order.products.forEach((op) => {
      const id = op.productId.toString();
      productSalesMap[id] = (productSalesMap[id] || 0) + op.quantity;

      const prod = products.find((p) => p._id.toString() === id);
      if (prod) {
        const unitProfit = prod.price - (prod.wholesalePrice || 0);
        productProfitMap[id] =
          (productProfitMap[id] || 0) + unitProfit * op.quantity;
      }
    }),
  );

  const topProducts = products
    .map((p) => ({
      ...p,
      sold: productSalesMap[p._id.toString()] || 0,
      profit: productProfitMap[p._id.toString()] || 0,
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // ---------- Top customers ----------
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

  // ---------- Charts data ----------
  const pieData = [
    { name: "Pending", value: pendingOrders },
    { name: "Completed", value: completedOrders },
  ];

  const barData = products.map((p) => ({ name: p.title, stock: p.stock }));

  // Choose interval to avoid label overlap
  const xInterval = products.length > 12 ? Math.ceil(products.length / 12) : 0;

  return (
    <div className="wrapper py-6 flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">
        📊 Inventory & Sales Dashboard
      </h1>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Orders Today</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {ordersToday.length}
          </h2>
        </Card>

        <Card className="p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Order Status</p>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={28}
                outerRadius={48}
                paddingAngle={4}
                label
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLOR_PALETTE[i % COLOR_PALETTE.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <h2 className="text-3xl font-bold text-red-600">{lowStockItems}</h2>
        </Card>

        <Card className="p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Revenue Today</p>
          <h2 className="text-3xl font-bold text-green-600">
            ${revenueToday.toFixed(2)}
          </h2>
        </Card>

        <Card className="p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Profit Today</p>
          <h2 className="text-3xl font-bold text-purple-600">
            ${profitToday.toFixed(2)}
          </h2>
        </Card>
      </div>

      {/* Product summary */}
      <section>
        <h2 className="text-xl font-semibold mb-3">📦 Product Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productSummary.map(({ product, status }) => (
            <Card
              key={product._id.toString()}
              className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div className="min-w-0">
                <p className="font-semibold line-clamp-2">{product.title}</p>
                <p className="text-sm text-gray-500">
                  {product.stock} in stock
                </p>
              </div>
              <Badge
                variant={status === "Low Stock" ? "destructive" : "default"}
                className="px-3 py-1"
              >
                {status}
              </Badge>
            </Card>
          ))}
        </div>
      </section>

      {/* Top selling products */}
      <section>
        <h2 className="text-xl font-semibold mb-3">🔥 Top Selling Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topProducts.map((p) => (
            <Card
              key={p._id.toString()}
              className="p-4 flex flex-col gap-2 hover:bg-gray-50 transition"
            >
              <p className="font-medium line-clamp-2 truncate">{p.title}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="whitespace-nowrap">
                  {p.sold} sold
                </Badge>
                <Badge variant="default" className="whitespace-nowrap">
                  Profit: ${p.profit.toFixed(2)}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Top customers */}
      <section>
        <h2 className="text-xl font-semibold mb-3">👥 Top Customers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCustomers.map((c) => (
            <Card
              key={c._id.toString()}
              className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <p className="font-medium line-clamp-2 truncate">{c.name}</p>
              <Badge variant="secondary" className="whitespace-nowrap">
                ${c.totalSpent.toFixed(2)}
              </Badge>
            </Card>
          ))}
        </div>
      </section>

      {/* Stock levels chart */}
      <section>
        <h2 className="text-xl font-semibold mb-3">📉 Stock Levels</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={xInterval}
                tickFormatter={(val: string) => truncate(val, 14)}
                height={60}
                angle={0}
                textAnchor="middle"
              />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="stock" isAnimationActive={false}>
                {products.map((p, idx) => (
                  <Cell
                    key={p._id.toString()}
                    fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend for full product names (scrollable on overflow) */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            {products.map((p, i) => (
              <div
                key={p._id.toString()}
                className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded text-sm"
              >
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{
                    background: COLOR_PALETTE[i % COLOR_PALETTE.length],
                  }}
                />
                <span className="max-w-xs truncate">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="text-xl font-semibold mb-3">🕒 Recent Activity</h2>
        <RecentActivity tenantId={tenantId} />
      </section>
    </div>
  );
}
