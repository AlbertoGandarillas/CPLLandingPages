import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}
export default function StatCard({ title, value, icon, children }: StatCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-xl font-bold xl:text-xs 2xl:text-xl">{value}</h3>
        </div>
        <div className="flex flex-col items-center text-muted-foreground">
          {icon}
          {children && (
            <ChevronDown 
              className={`h-4 w-4 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              onClick={() => setIsOpen(!isOpen)} 
            />
          )}
        </div>
      </CardContent>
      {isOpen && (
        <CardFooter>
          {children}
        </CardFooter>
      )}
    </Card>
  );
}
