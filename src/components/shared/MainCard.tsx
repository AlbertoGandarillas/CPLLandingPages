import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
interface MainCardProps {
  title: string;
  tooltipContent?: string;
  children: React.ReactNode;
}
export default function MainCard({
  title,
  tooltipContent,
  children,
}: MainCardProps) {
  return (
    <Card className="w-full">
      <CardHeader
        className="bg-gray-100
      "
      >
        <CardTitle className="flex items-center gap-1">
          {tooltipContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} strokeWidth={2.5} />
                </TooltipTrigger>
                <TooltipContent className="absolute text-xs w-[400px]">
                  {tooltipContent}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
