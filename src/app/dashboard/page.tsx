"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import React from 'react';
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/inventory');
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
      <span className="ml-2 text-lg text-gray-500">Redirecting...</span>
    </div>
  );
}
