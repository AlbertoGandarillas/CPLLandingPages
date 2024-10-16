import { ReactNode } from "react";
export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex h-screen">

        {children}
    </div>
  );
}
