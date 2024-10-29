import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  maxHeight?: string;
}

export function DataTable({
  data,
  columns,
  onRowClick,
  maxHeight = "400px",
}: DataTableProps) {
  const [sorting, setSorting] = useState<{
    column: string;
    direction: "asc" | "desc";
  }>({ column: "", direction: "asc" });

  const sortedData = useMemo(() => {
    if (sorting.column) {
      return [...data].sort((a, b) => {
        if (a[sorting.column] < b[sorting.column])
          return sorting.direction === "asc" ? -1 : 1;
        if (a[sorting.column] > b[sorting.column])
          return sorting.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [data, sorting]);

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setSorting({
                      column: column.key,
                      direction:
                        sorting.column === column.key &&
                        sorting.direction === "asc"
                          ? "desc"
                          : "asc",
                    })
                  }
                >
                  {column.label}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow
              key={index}
              onClick={() => onRowClick && onRowClick(row)}
              className="cursor-pointer hover:bg-gray-100"
            >
              {columns.map((column) => (
                <TableCell key={column.key}>{row[column.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
