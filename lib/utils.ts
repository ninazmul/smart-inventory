import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import qs from "query-string";

import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";
import { IActivity } from "./database/models/activity.model";
import { IOrder } from "./database/models/order.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    timeZone: "Australia/Sydney", // Sydney time zone
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
    timeZone: "Australia/Sydney", // Sydney time zone
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    timeZone: "Australia/Sydney", // Sydney time zone
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions,
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions,
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions,
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AUD",
  }).format(amount);

  return formattedPrice;
};

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export const handleError = (error: unknown) => {
  console.error(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

export const generateOrderId = () => {
  const date = new Date();
  const datePart = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `ORD-${datePart}-${randomPart}`;
};

export interface PlainActivity {
  _id: string;
  tenantId: string;
  message: string;
  timestamp: string; // ISO string
}

export function sanitizeActivity(activity: IActivity): PlainActivity {
  return {
    _id: activity._id.toString(),
    tenantId: activity.tenantId,
    message: activity.message,
    timestamp:
      activity.timestamp instanceof Date
        ? activity.timestamp.toISOString()
        : String(activity.timestamp),
  };
}

export interface PlainOrderProduct {
  productId: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface PlainOrder {
  _id: string;
  tenantId: string;
  products: PlainOrderProduct[];
  totalPrice: number;

  name: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  notes?: string;

  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

  createdAt: string;
  updatedAt: string;
}

export function sanitizeOrder(order: IOrder): PlainOrder {
  return {
    _id: order._id.toString(),
    tenantId: order.tenantId,
    products: order.products.map((p) => ({
      ...p,
      productId: p.productId.toString(),
    })),
    totalPrice: order.totalPrice,

    name: order.name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    notes: order.notes,

    status: order.status,
    createdAt:
      order.createdAt instanceof Date
        ? order.createdAt.toISOString()
        : String(order.createdAt),
    updatedAt:
      order.updatedAt instanceof Date
        ? order.updatedAt.toISOString()
        : String(order.updatedAt),
  };
}
