import React, { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { PotentialCPLSavings } from "@prisma/client";
import { useTheme } from "next-themes";

type PotentialSavingsProps = {
  potentialSavingsData: PotentialCPLSavings[];
  setSelectedCollege: (college: string) => void;
};

function PotentialSavings({
  potentialSavingsData,
  setSelectedCollege,
}: PotentialSavingsProps) {
  const { theme } = useTheme();

  const columns = useMemo<MRT_ColumnDef<PotentialCPLSavings>[]>(
    //column definitions...
    () => [
      {
        accessorKey: "College",
        header: "College",
      },
      {
        accessorKey: "Savings",
        header: "Savings & PoF",
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return formatCurrency(value);
        },
      },
      {
        accessorKey: "YearImpact",
        header: "20-Year Impact",
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return formatCurrency(value);
        },
      },
      {
        accessorKey: "Combined",
        header: "Combined",
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return formatCurrency(value);
        },
      },
      {
        accessorKey: "Students",
        header: "Students",
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return Math.round(value).toLocaleString();
        },
      },
      {
        accessorKey: "Units",
        header: "CPL Units *",
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return (
            <div style={{ textAlign: 'center' }}>
              {Math.round(value).toLocaleString()}
            </div>
          );
        },
      },
      {
        accessorKey: "AverageUnits",
        header: "Avg",
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return Number(value).toFixed(1);
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: potentialSavingsData ?? [],
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableStickyHeader: true,
    enableStickyFooter: false,
    enablePagination: false,
    muiTableContainerProps: { sx: { maxHeight: "500px" } },
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: theme === "dark" ? "hsl(var(--background))" : "hsl(var(--background))",
        color: theme === "dark" ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
        fontWeight: "normal",
        fontSize: "12px",
        fontFamily: "var(--font-sans)",
        padding: "10px",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: theme === "dark" ? "hsl(var(--muted))" : "hsl(var(--muted))",
        color: theme === "dark" ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))",
        fontWeight: "bold",
        fontSize: "12px",
        fontFamily: "var(--font-sans)",
        padding: "10px",
      },
    },
    muiTableProps: {
      sx: {
        fontFamily: "var(--font-sans)",
        backgroundColor: theme === "dark" ? "hsl(var(--background))" : "hsl(var(--background))",
      }
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setSelectedCollege(row.original.CollegeID.toString());
      },
      sx: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: theme === "dark" ? "hsl(var(--muted))" : "hsl(var(--muted))",
        },
      },
    }),
  });

  return <MaterialReactTable table={table} />;
}

export default PotentialSavings;
