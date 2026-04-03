// Searchable multi-select product picker (replace your Add Products block with this)
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { IProduct } from "@/lib/database/models/product.model";
import { X } from "lucide-react";

type ProductPickerProps = {
  products: IProduct[];
  onAdd: (product: IProduct) => void; // called when user confirms add for a product
  placeholder?: string;
  maxVisible?: number; // how many results to show in dropdown
};

export default function ProductPicker({
  products,
  onAdd,
  placeholder = "Search products...",
  maxVisible = 8,
}: ProductPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(0);
  const [selected, setSelected] = useState<IProduct[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // filter products by query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  // visible slice to avoid huge lists
  const visible = filtered.slice(0, maxVisible);

  useEffect(() => {
    // reset highlight when filtered changes
    setHighlight(0);
  }, [query, filtered.length]);

  // keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, visible.length - 1));
      scrollToHighlight();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
      scrollToHighlight();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = visible[highlight];
      if (item) selectProduct(item);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const scrollToHighlight = () => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[highlight] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ block: "nearest" });
  };

  const selectProduct = (p: IProduct) => {
    // avoid duplicates
    if (!selected.find((s) => s._id.toString() === p._id.toString())) {
      setSelected((s) => [...s, p]);
      onAdd(p);
    }
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeSelected = (id: string) => {
    setSelected((s) => s.filter((x) => x._id.toString() !== id));
  };

  return (
    <div className="mt-4">
      <p className="font-semibold mb-3">Add Products</p>

      <div className="relative max-w-3xl">
        {/* Selected chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((p) => (
            <div
              key={p._id.toString()}
              className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md text-sm"
            >
              <span className="max-w-[200px] truncate">{p.title}</span>
              <button
                onClick={() => removeSelected(p._id.toString())}
                className="p-1 rounded hover:bg-gray-200"
                aria-label={`Remove ${p.title}`}
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls="product-picker-list"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              // small timeout to allow click on dropdown items
              setTimeout(() => setOpen(false), 150);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
              setOpen(true);
            }}
            className="inline-flex items-center px-3 py-2 rounded-lg border bg-white text-sm hover:shadow-sm"
          >
            Clear
          </button>
        </div>

        {/* Dropdown */}
        {open && (
          <ul
            id="product-picker-list"
            ref={listRef}
            className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-lg border bg-white shadow-lg"
            role="listbox"
          >
            {visible.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                No products found
              </li>
            ) : (
              visible.map((p, i) => {
                const isHighlighted = i === highlight;
                const isSelected = !!selected.find(
                  (s) => s._id.toString() === p._id.toString(),
                );
                return (
                  <li
                    key={p._id.toString()}
                    role="option"
                    aria-selected={isHighlighted}
                    onMouseEnter={() => setHighlight(i)}
                    onMouseDown={(e) => {
                      // prevent blur before click
                      e.preventDefault();
                      selectProduct(p);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${
                      isHighlighted ? "bg-blue-50" : "hover:bg-gray-50"
                    } ${isSelected ? "opacity-60" : ""}`}
                  >
                    <div className="flex-shrink-0">
                      {p.mainImage ? (
                        <Image
                          src={p.mainImage}
                          alt={p.title}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded object-cover border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          No Img
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">{p.title}</p>
                        <span className="text-sm font-semibold text-gray-700">
                          ${p.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            p.stock <= p.minimumStockThreshold
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                        <span className="truncate">
                          {p.category || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })
            )}

            {/* If there are more results than visible, show a footer hint */}
            {filtered.length > maxVisible && (
              <li className="px-3 py-2 text-xs text-gray-500">
                Showing {maxVisible} of {filtered.length} results. Narrow your
                search to see more.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
