import React, { useState, useEffect } from "react";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { Input } from "@/components/ui/input";
import { usePotentialSavings } from "@/hooks/usePotentialSavings";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { SummaryStats } from "./SummaryStats";
import CPLChart from "./CPLChart";
import { DropdownCatalogYear } from "@/components/shared/DropdownCatalogYear";
import PotentialSavings from "@/components/shared/PotentialSavings";
import { formatCurrency } from "@/lib/utils";
interface PotentialSavingsTableProps {
  setSelectedCollege?: (CollegeID: string | null) => void;
  hideCPLImpactChart?: boolean;
  onCatalogYearSelect?: (catalogYear: string | null) => void;
  selectedCatalogYear?: string | null;
}

export const PotentialSavingsTable = ({
  setSelectedCollege,
  hideCPLImpactChart = false,
  onCatalogYearSelect,
  selectedCatalogYear: externalSelectedCatalogYear,
}: PotentialSavingsTableProps) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedType, setSelectedType] = useState<string>("0");
  const [selectedCatalogYear, setSelectedCatalogYear] = useState<string | null>(
    null
  );
  const { data, isLoading, error } = usePotentialSavings(
    selectedType,
    selectedCatalogYear
  );
  useEffect(() => {
    if (externalSelectedCatalogYear !== undefined) {
      setSelectedCatalogYear(externalSelectedCatalogYear);
    }
  }, [externalSelectedCatalogYear]);

  const handleCatalogYearSelect = (yearId: string | null) => {
    console.log("PotentialSavingsTable - Selected Year:", yearId);
    setSelectedCatalogYear(yearId);
    if (onCatalogYearSelect) {
      onCatalogYearSelect(yearId);
    }
  };

  const getSummaryStatsData = React.useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.CollegeID === 0)
      .map((item) => ({
        College: item.College,
        Savings: item.Savings,
        YearImpact: item.YearImpact,
        Combined: item.Combined,
        Students: item.Students,
        AvgUnits: item.AverageUnits,
        Units: item.Units,
      }));
  }, [data]);

  const getCPLImpactData = React.useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.CollegeID !== 0)
      .map((item) => ({
        College: item.College,
        Savings: item.Savings,
        YearImpact: item.YearImpact,
        Combined: item.Combined,
        Students: item.Students,
        AvgUnits: item.AverageUnits,
        Units: item.Units,
      }));
  }, [data]);

  const exportToExcel = (data: any[], fileName: string) => {
    const formattedData = data.map((row) => ({
      College: row.College,
      "Savings & PoF": formatCurrency(row.Savings),
      "20-Year Impact": formatCurrency(row.YearImpact),
      Combined: formatCurrency(row.Combined),
      Students: Math.round(row.Students).toLocaleString(),
      "Eligible CPL *": Math.round(row.Units).toLocaleString(),
      Avg: Number(row.AverageUnits).toFixed(1),
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const colWidths = [
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
      { wch: 8 },
    ];

    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const filteredData = React.useMemo(
    () =>
      data?.filter(
        (item) =>
          item.College &&
          item.College.toLowerCase().includes(filterValue.toLowerCase())
      ) || [],
    [data, filterValue]
  );

  const handleTypeChange = (value: string) => {
    setSelectedType(value || "0");
  };

  const handleRowClick = (CollegeID: string) => {
    if (CollegeID !== "0" && setSelectedCollege) {
      setSelectedCollege(CollegeID === "0" ? null : CollegeID);
    }
  };

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />
    );
  }

  if (error) {
    console.error("Error loading Potential Savings:", error);
    return <div>Error loading Potential Savings</div>;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center sm:justify-between "></div>
      <div className="flex flex-col xl:flex-row gap-4">
        <div
          className={`w-full ${
            hideCPLImpactChart ? "xl:w-full 2xl:w-full" : "xl:w-1/2 2xl:w-3/4"
          }`}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-4 mb-4">
            <div className="lg:col-span-1 md:col-span-1">
              <ToggleGroup
                type="single"
                value={selectedType}
                onValueChange={handleTypeChange}
                className="p-1 rounded-lg w-full"
              >
                <ToggleGroupItem
                  value="0"
                  aria-label="All"
                  className="data-[state=on]:bg-muted"
                >
                  All
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="1"
                  aria-label="Military"
                  className="data-[state=on]:bg-muted"
                >
                  Military
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="2"
                  aria-label="Working Adult"
                  className="data-[state=on]:bg-muted"
                >
                  Working Adult
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="lg:col-span-1 md:col-span-1 text-center">
              <span className="text-xs font-bold pr-2">Academic Year </span>
              <DropdownCatalogYear
                selectedCatalogYear={selectedCatalogYear}
                onCatalogYearSelect={handleCatalogYearSelect}
                className="w-full"
              />
            </div>
            <div className="lg:col-span-1 md:col-span-1">
              <div className="flex gap-2 p-1">
                <Input
                  placeholder="Filter Colleges..."
                  value={filterValue}
                  onChange={(event) => setFilterValue(event.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="lg:col-span-1 md:col-span-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => exportToExcel(filteredData, "PotentialSavings")}
                className="w-full"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            <SummaryStats
              data={getSummaryStatsData}
              formatCurrency={formatCurrency}
            />
          </div>
          <div>
            <div className="rounded-md border">
              <PotentialSavings setSelectedCollege={handleRowClick} potentialSavingsData={filteredData ?? []} />
            </div>
          </div>
        </div>
        {!hideCPLImpactChart && (
          <div className="w-full xl:w-1/2 2xl:w-1/3">
            <CPLChart data={getCPLImpactData} />
          </div>
        )}
      </div>
    </>
  );
};
