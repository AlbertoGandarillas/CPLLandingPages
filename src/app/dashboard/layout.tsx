"use client";
import * as React from "react";
import { ReactNode } from "react";
import Image from "next/image";
import {
  Check,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Search,
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
const data = {
  navMain: [
    {
      title: "Additional Resources",
      url: "#",
      items: [
        {
          title: "Upload your JST",
          url: "https://veteransmapsearch.azurewebsites.net/default.aspx",
          target: "_blank",
        },
        {
          title: "Sign into MAP",
          url: "https://mappingarticulatedpathways.azurewebsites.net/modules/security/login.aspx",
          target: "_blank",
        },
      ],
    },
  ],
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="bg-[#1e3964]">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/images/map-logo-white.png"
              alt="MAP"
              width={100}
              height={100}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="inline-block object-contain"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent className="bg-[#1e3964] text-white">
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title} >
              <SidebarGroupLabel className="text-white text-lg">{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} target={item.target}>{item.title}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">
            Approved Credit for Prior Learning Opportunities
          </h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
