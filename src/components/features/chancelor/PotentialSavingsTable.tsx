import React, { useState, useEffect } from "react";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { Input } from "@/components/ui/input";
import { usePotentialSavings } from "@/hooks/usePotentialSavings";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  BarChart2,
  DollarSign,
  FileSpreadsheet,
  Layers,
  Users,
} from "lucide-react";
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
import StatCard from "./StatCard";
import CPLImpact from "./CPLImpact";
import CPLImpactChart from "./CPLImpactChart";
import CPLImpactScoreChart from "./CPLImpactScoreChart";
interface PotentialSavingsTableProps {
  setSelectedCollege?: (CollegeID: string) => void;
}

export const PotentialSavingsTable = ({
  setSelectedCollege,
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
      <div className="text-left w-[200px]">
        {row.getValue("College")}
      </div>
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
  const getTopTenColleges = React.useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.CollegeID !== 0) 
      .slice(0, 10) 
      .map((item) => ({
        name: item.College.replace(/\s*college\s*/gi, ""), 
        Combined: item.Combined / 1000000, 
        Students: item.Students / 1000, 
      }));
  }, [data]);

  const getCPLImpactData = React.useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.CollegeID !== 0)
      .slice(0, 10)
      .map((item) => ({
        College: item.College,
        Savings: item.Savings,
        YearImpact: item.YearImpact,
        Combined: item.Combined,
        Students: item.Students,
        AvgUnits: item.AverageUnits,
        Units: item.Units
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
      setSelectedCollege(CollegeID);
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
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between pb-4">
        <ToggleGroup
          type="single"
          value={selectedType}
          onValueChange={handleTypeChange}
          className="bg-gray-100 p-1"
        >
          <ToggleGroupItem
            value="0"
            aria-label="All"
            className="data-[state=on]:bg-white"
          >
            All
          </ToggleGroupItem>
          <ToggleGroupItem
            value="1"
            aria-label="Military"
            className="data-[state=on]:bg-white"
          >
            Military
          </ToggleGroupItem>
          <ToggleGroupItem
            value="2"
            aria-label="Working Adult"
            className="data-[state=on]:bg-white"
          >
            Working Adult
          </ToggleGroupItem>
        </ToggleGroup>
        <Input
          placeholder="Filter Colleges..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="w-full max-w-sm bg-blue-100"
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={() => exportToExcel(filteredData, "PotentialSavings")}
          className="w-full sm:w-auto"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
      </div>
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="w-full xl:w-1/2 2xl:w-3/4 ">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            {data
              ?.filter((item, index) => item.CollegeID === 0)
              .slice(0, 1)
              .map((item) => (
                <React.Fragment key={item.CollegeID}>
                  <StatCard
                    title="Savings & PoF"
                    value={`${formatCurrency(item.Savings)}`}
                    icon={<DollarSign className="h-6 w-6" />}
                  />
                  <StatCard
                    title="20-Year Impact"
                    value={`${formatCurrency(item.YearImpact)}`}
                    icon={<BarChart2 className="h-6 w-6" />}
                  />
                  <StatCard
                    title="Combined"
                    value={`${formatCurrency(item.Combined)}`}
                    icon={<Layers className="h-6 w-6" />}
                  />
                  <StatCard
                    title="Students"
                    value={item.Students.toLocaleString()}
                    icon={<Users className="h-6 w-6" />}
                  />
                </React.Fragment>
              ))}
          </div>
          <div>
            <div className="rounded-md border overflow-y-auto max-h-[500px]">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-bold text-black">
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
                          <TableCell key={cell.id}>
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
        <div className="w-full xl:w-1/2 2xl:w-1/4">
          <CPLImpactScoreChart data={getCPLImpactData} />
        </div>
      </div>
    </>
  );
};