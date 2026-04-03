"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarSections = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        title: "Products",
        url: "/products",
        icon: Boxes,
      },
      {
        title: "Categories",
        url: "/categories",
        icon: Tags,
      },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        title: "Orders",
        url: "/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    label: "Customers",
    items: [
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
      },
    ],
  },
];

const AdminSidebar = () => {
  const currentPath = usePathname();

  return (
    <Sidebar
      className="text-[#3e0078] font-semibold font-serif"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-3">
          <Image
            src="/assets/images/logo.png"
            width={120}
            height={80}
            alt="Smart Inventory"
          />
        </div>

        {/* Sections */}
        {sidebarSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-xs uppercase tracking-wide text-gray-500 px-4">
              {section.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? currentPath === item.url
                      : currentPath === item.url ||
                        currentPath.startsWith(`${item.url}/`);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                            isActive
                              ? "bg-[#3e0078] text-white shadow-sm"
                              : "hover:bg-[#f3e8ff]"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
