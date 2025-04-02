import React from "react";
import {
  BarChart2,
  ChevronDown,
  DollarSign,
  Layers,
  Ruler,
  Users,
} from "lucide-react";
import StatCard from "./StatCard";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";

interface SummaryStatsProps {
  data: {
    College: string;
    Savings: number;
    YearImpact: number;
    Combined: number;
    Students: number;
    MilitaryCredits: number;
    NonMilitaryCredits: number;
    MilitaryStudents: number;
    NonMilitaryStudents: number;
    Units: number;
  }[];
  formatCurrency: (value: number) => string;
  selectedType: string;
}

export const SummaryStats = ({ data, formatCurrency, selectedType }: SummaryStatsProps) => {
  return (
    <>
      {data.map((item, index) => (
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
            title="Units"
            value={item.Units ? item.Units.toLocaleString() : "0"}
            icon={<Ruler className="h-6 w-6" />}
          >
            {selectedType === "0" ? (
              <div className="w-full flex justify-between lg:flex-col 2xl:flex-row gap-2 text-sm">
                <div className="flex justify-between gap-2">
                  <p>Military</p>
                  <p>{ item.MilitaryCredits > 0 ? item.MilitaryCredits.toLocaleString() : "0"}</p>
                </div>
                <div className="flex justify-between gap-2">
                  <p>Workig Adult</p>
                  <p>{ item.NonMilitaryCredits > 0 ? item.NonMilitaryCredits.toLocaleString() : "0"}</p>
                </div>
              </div>
            ) : selectedType === "1" ? (
              <div className="w-full text-sm flex justify-start gap-2">
                  <p>Military</p>
                  <p>{ item.MilitaryCredits > 0 ? item.MilitaryCredits.toLocaleString() : "0"}</p>

              </div>
            ) : (
              <div className="w-full text-sm flex justify-start gap-2">
                  <p>Workig Adult</p>
                  <p>{ item.NonMilitaryCredits > 0 ? item.NonMilitaryCredits.toLocaleString() : "0"}</p>
              </div>
            )}
          </StatCard>
          <StatCard
            title="Students"
            value={item.Students ? item.Students.toLocaleString() : "0"}
            icon={<Users className="h-6 w-6" />}
          >
            <div className="w-full flex justify-between gap-2 text-sm">
              {selectedType === "0" ? ( 
                <div className="w-full flex justify-between lg:flex-col  2xl:flex-row gap-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <p>Military</p>
                    <p>{ item.MilitaryStudents > 0 ? item.MilitaryStudents.toLocaleString() : "0"}</p>
                  </div>
                  <div className="flex justify-between gap-2">
                    <p>Working Adult</p>
                    <p>{ item.NonMilitaryStudents > 0 ? item.NonMilitaryStudents.toLocaleString() : "0"}</p>
                  </div>
                </div>
              ) : selectedType === "1" ? (
                <div className="w-full text-sm flex justify-start gap-2">
                    <p>Military</p>
                    <p>{ item.MilitaryStudents > 0 ? item.MilitaryStudents.toLocaleString() : "0"}</p>
                </div>
              ) : (
                <div className="w-full text-sm flex justify-start gap-2">
                    <p>Working Adult</p>
                    <p>{ item.NonMilitaryStudents > 0 ? item.NonMilitaryStudents.toLocaleString() : "0"}</p>
                </div>
              )}
            </div>
          </StatCard>
        </React.Fragment>
      ))}
    </>
  );
};
