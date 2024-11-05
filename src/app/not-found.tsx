import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";


export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[420px] shadow-lg">
        <CardHeader className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been removed, had its name changed, or is temporarily
            unavailable.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-x-4">
          <Link href="/chancellor" className="text-center text-xs text-blue-700" target="_blank">
            Go to Potential CPL Savings & Preservation of Funds (PoF), 20
            Year-Impact College Metrics website
          </Link>
          <Link
            href="https://map.rccd.edu/" target="_blank"
            className="text-center text-xs text-blue-700 mt-4"
          >
            Go to CALIFORNIA MAP INITIATIVE website
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
