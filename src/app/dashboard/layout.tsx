"use client";
import * as React from "react";
import { ReactNode } from "react";
import Image from "next/image";
import {
  Check,
  ChevronsUpDown,
  GalleryVerticalEnd,
  LogIn,
  Search,
  Upload,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Footer from "@/components/dashboard/Footer";
import { Header } from "@/components/dashboard/Header";

const actionItems = [
  { name: "Upload Your JST", icon: Upload, href: "https://veteransmapsearch.azurewebsites.net/default.aspx", primary: false },
  { name: "Sign into MAP", icon: LogIn, href: "https://mappingarticulatedpathways.azurewebsites.net/modules/security/login.aspx", primary: true },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  return (
    <div className="flex flex-col min-h-screen">
      <Header actionItems={actionItems} />

      <main className="flex-grow p-6 bg-background">
        {children}
      </main>

      <Footer actionItems={actionItems} />
    </div>
  );
}
