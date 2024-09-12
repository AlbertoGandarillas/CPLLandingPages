import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";
const appName = `${process.env.NEXT_PUBLIC_APP_NAME}`;
export const metadata: Metadata = {
  title: appName,
  description: "Powered by ITPI",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RootProviders>
          <div className="flex flex-col min-h-screen font-sans">{children}</div>
          <Toaster richColors position="bottom-right" />
        </RootProviders>
      </body>
    </html>
  );
}
