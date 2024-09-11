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
  className?: string;
}
export default function MainCard({
  title,
  tooltipContent,
  children,
  className,
}: MainCardProps) {
  return (
    <Card className={`${className}`}>
      <CardHeader
        className="bg-gray-100
      "
      >
        <CardTitle className="flex text-lg items-center gap-1">
          {tooltipContent && <InfoTooltip content={tooltipContent} />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
interface InfoTooltipProps {
  content: string;
}

function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info size={16} strokeWidth={2.5} />
        </TooltipTrigger>
        <TooltipContent className="absolute text-xs w-[400px]">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}