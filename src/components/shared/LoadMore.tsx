import { Button } from "@/components/ui/button";
import { CircleEllipsis, Loader2, RefreshCw } from "lucide-react";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  className?: string;
}

export default function LoadMoreButton({
  onClick,
  isLoading,
  className = "",
}: LoadMoreButtonProps) {
  return (
    <div className={`flex justify-center mt-4 ${className}`}>
      <Button
        onClick={onClick}
        disabled={isLoading}
        variant="outline"
        className="min-w-[120px]"
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Load More</span>
          </div>
        )}
      </Button>
    </div>
  );
}
