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
  headerAlign?: string; // Add alignment for header
  cellAlign?: string;  // Add alignment for cells
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
    <div className="rounded-md border">
      {/* Header Table */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="sticky top-0 bg-muted z-10">
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={`font-bold text-black ${column.headerAlign || ''}`}
                >
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
        </Table>
      </div>

      {/* Body Table with Scrolling */}
      <div className="overflow-y-auto" style={{ maxHeight }}>
        <Table>
          <TableBody>
            {sortedData.length ? (
              sortedData.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick && onRowClick(row)}
                  className="cursor-pointer hover:bg-muted"
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={column.key}
                      className={column.cellAlign || ''}
                    >
                      {row[column.key]}
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
}
