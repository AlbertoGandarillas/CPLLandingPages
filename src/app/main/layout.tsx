import UserInfo from "@/components/portal/UserInfo";
import Link from "next/link";
import Image from "next/image";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import RequestReview from "@/components/portal/RequestReview";
import { ReactNode } from "react";
export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
    const options = [
      //{
      //  name: "CPL For You",
      //  href: "/cpl-for-you",
      //},
      {
        name: "Find a MAP College",
        href: "/find-a-map-college",
      },
      // {
      //   name: "Contact a CPL Assistant", 
      //   href: "#",
      // },
      // {
      //   name: "Portfolio Builder",
      //   href: "/portfolio-builder", 
      // },
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
    <div className=" flex h-screen">
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
              <nav className="grid items-start mt-2 px-2 text-sm font-medium lg:px-4">
                <div className="mb-2">
                {options.map((option, index) => (
                  <Link
                    key={index}
                    href={option.href}
                    className={`flex items-center justify-center gap-3 rounded-lg px-3 py-3 my-2 text-white transition-all hover:text-primary bg-[#1e3964]`}
                  >
                    {option.name}
                  </Link>
                ))}
                {additionalOptions.map((option, index) => (
                  <Link
                  key={index}
                  href={option.href}
                  className={`flex justify-center items-center w-full gap-3 rounded-lg px-3 py-3 my-2 text-muted-foreground transition-all hover:text-primary bg-muted`}
                  >
                    {option.name}
                  </Link>
                ))}
                </div>
                <RequestReview type="mobile" />
              </nav>
            </div>
            <div className="mt-auto p-4"></div>
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
          </header>
          <main className="w-full flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex flex-col gap-1">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
