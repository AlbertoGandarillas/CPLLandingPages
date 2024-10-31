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
              value={formatCurrency(item.Savings)}
              icon={<DollarSign className="h-6 w-6" />}
            />
            <StatCard
              title="20-Year Impact"
              value={formatCurrency(item.YearImpact)}
              icon={<BarChart2 className="h-6 w-6" />}
            />
            <StatCard
              title="Combined"
              value={formatCurrency(item.Combined)}
              icon={<Layers className="h-6 w-6" />}
            />
            <StatCard
              title="Students"
              value={item.Students.toLocaleString()}
              icon={<Users className="h-6 w-6" />}
            />
          </React.Fragment>
        ))}
    </>
  );
};
