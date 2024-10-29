import { ReactNode } from "react";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-[#efeff0] via-[#cfcfcf] to-white">
        {children}
      </main>
      <Footer />
    </div>
  );
}
