import React, { useState, useEffect } from "react";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { Input } from "@/components/ui/input";
import { usePotentialSavings } from "@/hooks/usePotentialSavings";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FileSpreadsheet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface PotentialSavingsTableProps {
  setSelectedCollege?: (CollegeID: string) => void;
}

export const PotentialSavingsTable = ({ setSelectedCollege }: PotentialSavingsTableProps) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedType, setSelectedType] = useState<string>("0");
  const { data, isLoading, error } = usePotentialSavings(selectedType);
  const [sorting, setSorting] = useState<SortingState>([]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null || value === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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
      enableGlobalFilter: false
    },
    {
      accessorKey: "College",
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
      cell: ({ row }) => formatCurrency(row.getValue("Savings")),
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
      cell: ({ row }) => formatCurrency(row.getValue("YearImpact")),
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
      cell: ({ row }) => formatCurrency(row.getValue("Combined")),
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

  const exportToExcel = (data: any[], fileName: string) => {
    const formattedData = data.map(row => ({
      College: row.College,
      'Savings & PoF': formatCurrency(row.Savings),
      '20-Year Impact': formatCurrency(row.YearImpact),
      Combined: formatCurrency(row.Combined),
      Students: row.Students,
      'Eligible CPL *': row.Units,
      'Avg': row.AverageUnits
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
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
    <div>
      <div className="flex items-center justify-between pb-4">
        <Input
          placeholder="Filter Colleges..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="w-full max-w-sm"
        />
        <ToggleGroup
          type="single"
          value={selectedType}
          onValueChange={handleTypeChange}
        >
          <ToggleGroupItem value="0" aria-label="All">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="1" aria-label="Military">
            Military
          </ToggleGroupItem>
          <ToggleGroupItem value="2" aria-label="Working Adult">
            Working Adult
          </ToggleGroupItem>
        </ToggleGroup>
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
      <div className="rounded-md border overflow-y-auto max-h-[250px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  onClick={() => handleRowClick(row.getValue("CollegeID"))}
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
  );
};
