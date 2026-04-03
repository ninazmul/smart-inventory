import { PlainOrder, PlainOrderProduct } from "@/lib/utils";
import Image from "next/image";

type InvoiceTemplateProps = {
  order: PlainOrder;
};

export default function InvoiceTemplate({ order }: InvoiceTemplateProps) {
  const formatDate = (date: Date | string | undefined) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  return (
    <div
      className="w-[210mm] min-h-[297mm] p-8 font-sans text-gray-900"
      style={{ boxSizing: "border-box" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-400 pb-4 mb-6">
        <div>
          <Image
            src="/assets/images/logo.png"
            alt="Smart Inventory Logo"
            width={200}
            height={80}
            unoptimized
            className="object-contain"
          />
        </div>

        <div className="text-right">
          <h1 className="text-3xl font-bold">INVOICE</h1>
          <p>Date: {formatDate(order.createdAt)}</p>
          <p>Status: {order.status}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex justify-between mb-6">
        <div className="w-1/2 pr-4">
          <h3 className="font-semibold mb-1">Bill To</h3>
          <p>{order.name}</p>
          {order.email && <p>{order.email}</p>}
          <p>{order.phone}</p>
          <p>
            {order.address}
            {order.city && `, ${order.city}`}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <table className="w-full border-collapse text-sm mb-6">
        <thead>
          <tr className="border-b border-gray-400">
            <th className="p-2 text-left">Thumbnail</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-center">Qty</th>
            <th className="p-2 text-right">Unit Price</th>
            <th className="p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p: PlainOrderProduct, i: number) => (
            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
              <td className="p-2 w-20 h-20 relative">
                <Image
                  src={p.image}
                  alt={p.title}
                  width={60}
                  height={60}
                  unoptimized
                  className="object-contain border p-1"
                />
              </td>
              <td className="p-2">{p.title}</td>
              <td className="p-2 text-center">{p.quantity}</td>
              <td className="p-2 text-right">৳{p.unitPrice.toFixed(2)}</td>
              <td className="p-2 text-right">৳{p.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-1/3">
          <div className="flex justify-between font-bold text-lg py-1">
            <span>Total</span>
            <span>৳{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-6">
          <h4 className="font-semibold mb-1">Customer Notes</h4>
          <p>{order.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 border-t border-gray-400 pt-2">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}
