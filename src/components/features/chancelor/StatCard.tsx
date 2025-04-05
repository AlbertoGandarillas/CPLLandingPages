import { Card, CardContent, CardFooter } from "@/components/ui/card";
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}
export default function StatCard({ title, value, icon, children }: StatCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="">
        <div className="flex items-center justify-between w-full py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-xl font-bold xl:text-xs 2xl:text-xl">{value}</h3>
          </div>
          <div className="flex flex-col items-center text-muted-foreground">
            {icon}
          </div>
        </div>
        {children && (
          <div className="w-full">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
