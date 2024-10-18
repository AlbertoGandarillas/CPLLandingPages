import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";

interface RequestReviewProps {
  type?: "mobile" | "desktop";
}

export default function RequestReview({ type }: RequestReviewProps) {
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
