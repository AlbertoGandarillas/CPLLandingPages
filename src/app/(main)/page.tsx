"use client";
import { useState } from "react";
import Image from "next/image";
import SearchBar from "@/components/shared/SearchBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { Bell, CircleUser, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Homepage() {
  const [open, setOpen] = useState("item-1");
  const [searchTerm, setSearchTerm] = useState("");
  const options = [
    {
      name: "Find a MAP College",
      href: "/find-a-map-college",
    },
    {
      name: "Contact a CPL Assistant",
      href: "/contact-a-cpl-assistant",
    },
    {
      name: "Portfolio Builder",
      href: "/portfolio-builder",
    },
  ];
  const additionalOptions = [
    {
      name: "CCCApply ID",
      href: "/cccapply-id",
    },
    {
      name: "FAFSA",
      href: "/fafsa",
    },
  ];
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-none bg-muted/20 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex justify-center h-14 items-center border-none px-4 lg:h-[60px] lg:px-6 bg-[#1e3964]">
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
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {options.map((option, index) => (
                <Link
                  key={index}
                  href={option.href}
                  className={`flex items-center justify-center gap-3 rounded-lg px-3 py-3 my-2 text-white transition-all hover:text-primary bg-[#1e3964]`}
                >
                  {option.name}
                </Link>
              ))}
              <h3 className="px-3 py-4 text-xl">Additional Resources</h3>
              {additionalOptions.map((option, index) => (
                <Link
                  key={index}
                  href={option.href}
                  className={`flex justify-center items-center w-full gap-3 rounded-lg px-3 py-3 my-2 text-muted-foreground transition-all hover:text-primary bg-muted`}
                >
                  {option.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <RequestReview type="mobile" />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-none px-4 lg:h-[60px] lg:px-6 bg-[#1e3964]">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <span className="sr-only">ITPI</span>
                </Link>
                {options.map((option, index) => (
                  <Link
                    key={index}
                    href={option.href}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                      index === 1
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    } hover:text-foreground`}
                  >
                    {option.name}
                  </Link>
                ))}
                <h2 className="px-3 py2">Additional Resources</h2>
                {additionalOptions.map((option, index) => (
                  <Link
                    key={index}
                    href={option.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                      index === 2 ? "bg-muted" : ""
                    }`}
                  >
                    {option.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <RequestReview />
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search keywords..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full ml-auto text-white"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <UserLogin />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Welcome</h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
interface RequestReviewProps {
  type?: "mobile" | "desktop";
}

function RequestReview({ type }: RequestReviewProps) {
  return (
    <Card {...(type === "mobile" ? { "x-chunk": "dashboard-02-chunk-0" } : {})}>
      <CardHeader className="p-2 pt-0 md:p-4">
        <CardDescription>
          If you would like to submit review request to MAP Support Center or
          College
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Button size="sm" className="w-full">
          Request a review here
        </Button>
      </CardContent>
    </Card>
  );
}
function UserLogin() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-white">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
