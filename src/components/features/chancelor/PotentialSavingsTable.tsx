import React, { useState, useEffect } from "react";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { Input } from "@/components/ui/input";
import { usePotentialSavings } from "@/hooks/usePotentialSavings";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FileSpreadsheet } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { SummaryStats } from "./SummaryStats";
import CPLChart from "./CPLChart";
interface PotentialSavingsTableProps {
  setSelectedCollege?: (CollegeID: string | null) => void;
  hideCPLImpactChart?: boolean;
}

export const PotentialSavingsTable = ({
  setSelectedCollege,
  hideCPLImpactChart = false,
}: PotentialSavingsTableProps) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedType, setSelectedType] = useState<string>("0");
  const { data, isLoading, error } = usePotentialSavings(selectedType);
  const [sorting, setSorting] = useState<SortingState>([]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null || value === undefined) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "CollegeID",
      enableHiding: true,
      enableSorting: false,
      header: "College ID",
      size: 0,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "College",
      size: 200,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            College
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-left w-[200px]">{row.getValue("College")}</div>
      ),
    },
    {
      accessorKey: "Savings",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Savings & PoF
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {formatCurrency(row.getValue("Savings"))}
        </div>
      ),
    },
    {
      accessorKey: "YearImpact",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            20-Year Impact
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {formatCurrency(row.getValue("YearImpact"))}
        </div>
      ),
    },
    {
      accessorKey: "Combined",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Combined
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {formatCurrency(row.getValue("Combined"))}
        </div>
      ),
    },
    {
      accessorKey: "Students",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Students
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {Math.round(row.getValue("Students")).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "Units",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Eligible CPL *
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {Math.round(row.getValue("Units")).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "AverageUnits",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Avg
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {Number(row.getValue("AverageUnits")).toFixed(1)}
        </div>
      ),
    },
  ];

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

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      columnVisibility: {
        CollegeID: false,
      },
    },
  });

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
        <div className={`w-full ${hideCPLImpactChart ? 'xl:w-full 2xl:w-full' : 'xl:w-1/2 2xl:w-3/4'}`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            <div className="lg:col-span-1">
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
            <div className="lg:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Filter Colleges..."
                  value={filterValue}
                  onChange={(event) => setFilterValue(event.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="lg:col-span-1">
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
              <div className="overflow-hidden">
                <Table>
                  <TableHeader className="sticky top-0  z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="font-bold"
                            style={{ width: header.getSize() }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                </Table>
              </div>
              <div className="overflow-y-auto max-h-[405px]">
                <Table>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            handleRowClick(row.getValue("CollegeID"))
                          }
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              style={{ width: cell.column.getSize() }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
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
