import React from "react";
import { BarChart2, DollarSign, Layers, Users } from "lucide-react";
import StatCard from "./StatCard";

interface SummaryStatsProps {
  data: {
    College: string;
    Savings: number;
    YearImpact: number;
    Combined: number;
    Students: number;
  }[];
  formatCurrency: (value: number) => string;
}

export const SummaryStats = ({ data, formatCurrency }: SummaryStatsProps) => {
  return (
    <>
      {data
        .map((item,index) => (
          <React.Fragment key={index}>
            <StatCard
              title="Savings & PoF"
              value={item.Savings ? formatCurrency(item.Savings) : "0"}
              icon={<DollarSign className="h-6 w-6" />}
            />
            <StatCard
              title="20-Year Impact"
              value={item.YearImpact ? formatCurrency(item.YearImpact) : "0"}
              icon={<BarChart2 className="h-6 w-6" />}
            />
            <StatCard
              title="Combined"
              value={item.Combined ? formatCurrency(item.Combined) : "0"}
              icon={<Layers className="h-6 w-6" />}
            />
            <StatCard
              title="Students"
              value={item.Students ? item.Students.toLocaleString() : "0"}
              icon={<Users className="h-6 w-6" />}
            />
          </React.Fragment>
        ))}
    </>
  );
};
