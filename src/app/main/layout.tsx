import Link from "next/link";
import Image from "next/image";
import { HelpCircle, Menu, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode } from "react";
import "leaflet/dist/leaflet.css";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/shared/ToggleMode";
import OnBoarding from "@/components/shared/OnBoarding";
export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  return (
    <div className=" flex h-screen">
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-none bg-muted/20 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex justify-between h-14 items-center border-none px-4 lg:h-[60px] lg:px-6 bg-[#1e3964]">
              <Link
                href="/main"
                className="flex items-center gap-2 font-semibold"
              >
                <Image
                  src="/images/map-logo-white.png"
                  alt="Map Logo"
                  style={{ width: "100px", height: "auto" }} // maintain aspect ratio
                />
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start mt-2 px-2 text-sm font-medium lg:px-4">
                <div className="my-2">
                  <Options />
                </div>
              </nav>
            </div>
            <div className="mt-auto p-4"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex justify-between h-14 items-center gap-4 border-none px-4 lg:h-[60px] lg:px-6 bg-[#1e3964]">
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
                  <Options />
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-white text-xl font-semibold">
              Credit for Prior Learning Portal
            </h1>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <OnBoarding />
            </div>
          </header>
          <main className="w-full flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex flex-col gap-1">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Options() {
      const options = [
        {
          icon: <School className="h-4 w-4" />,
          name: "Find a College with CPL",
          href: "/main/find-a-map-college",
          dataIntro: "find-map-college",
        },
      ];
      const additionalOptions = [
        {
          name: "CCCApply ID",
          href: "https://www.cccapply.org/en/apply",
        },
        {
          name: "FAFSA",
          href: "/fafsa",
        },
      ];
  return (
    <>
      { /*options.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="w-full"
        >
          <Button
            variant="default"
            data-intro={item.dataIntro}
            className="w-full justify-start text-white bg-[#1e3964] dark:text-white"
          >
            <div className="flex justify-start items-center gap-2">
              {item.icon}
              {item.name}
            </div>
          </Button>
        </Link>
      )) */}
      <Separator className="my-4" />
      <div data-intro="cccapply-fafsa">
        {additionalOptions.map((option, index) => (
          <Link
            key={index}
            href={option.href}
            target="_blank"
            className="w-full"
          >
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              {option.name}
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
}
