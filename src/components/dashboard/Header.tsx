import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../shared/ToggleMode";

interface ActionItem {
  name: string;
  icon: React.ElementType;
  href: string;
}

interface HeaderProps {
  actionItems: ActionItem[];
}

export function Header({ actionItems }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#1e3964] text-white">
      <div className="flex items-center space-x-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              {actionItems.map((item) => (
                <Link key={item.name} href={item.href} target="_blank" passHref>
                  <Button className="w-full justify-start">
                    {React.createElement(item.icon, {
                      className: "w-4 h-4 mr-2",
                    })}
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MAPLogo />
        </Link>
        <h2 className="text-sm font-bold lg:text-lg">
          Approved Credit for Prior Learning Opportunities
        </h2>
      </div>
      <div className="flex items-center space-x-4">
      <nav className="hidden md:flex items-center space-x-4">
        {actionItems.map((item) => (
          <Link key={item.name} href={item.href} passHref>
            <Button variant="secondary">
              {React.createElement(item.icon, { className: "w-4 h-4 mr-2" })}
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
      <ModeToggle />
      </div>
    </header>
  );
}
export function MAPLogo() {
  return (
    <Image
      src="/images/map-logo-white.png"
      alt="MAP Logo"
      width={100}
      height={50}
      style={{ width: "100px", height: "auto" }}
    />
  );
}