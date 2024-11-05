"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
const menuItems = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];
const appName = `${process.env.NEXT_PUBLIC_APP_NAME}`;
export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-[#1e3964] font-bold text-white p-2">
      <div className="flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex justify-between items-center gap-6 md:gap-10">
          <Link href="/chancellor" className="flex items-center space-x-2">
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
          <Image
            src="/images/ccc.png"
            alt="MAP"
            width={383}
            height={50}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="inline-block object-contain md:w-auto w-[306px]" 
          />
          <div className="hidden">
            <nav className="hidden md:flex items-center gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`md:flex items-center text-lg font-medium text-white transition-colors hover:text-white/80 sm:text-sm ${
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <MobileNav
                  items={menuItems}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
}

function MobileNav({
  items,
  setIsSidebarOpen,
}: {
  items: { title: string; href: string }[];
  setIsSidebarOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col space-y-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-foreground/60 transition-colors hover:text-foreground ${
            pathname === item.href ? "text-foreground" : ""
          }`}
          onClick={() => setIsSidebarOpen(false)}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
