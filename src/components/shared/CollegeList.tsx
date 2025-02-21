import React, { useMemo }    from 'react'
import { useColleges } from '@/hooks/useColleges';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { LookupColleges } from "@prisma/client";
type CollegeListProps = {
    className?: string; 
}
function CollegeList({ className }: CollegeListProps) {
    const { data, isLoading, error } = useColleges();
 const columns = useMemo<MRT_ColumnDef<LookupColleges>[]>(
   //column definitions...
   () => [
     {
       accessorKey: "CollegeID",
       header: "College ID",
     },
     {
       accessorKey: "College",
       header: "College",
     },
     {
    accessorKey: "CollegeAbbreviation",
       header: "College Abbreviation",
     },
     {
       accessorKey: "City",
       header: "City",
     },
   ],
   []
 );

 const table = useMaterialReactTable({
   columns,
   data: data ?? [],
   enableTopToolbar: false,
   enableBottomToolbar: false,
   enableStickyHeader: true,
   enableStickyFooter: false,
   enablePagination: false,
   muiTableContainerProps: { sx: { maxHeight: "400px" } },
   muiTableBodyCellProps: {
     sx: (theme) => ({
       backgroundColor:
         theme.palette.mode === "dark"
           ? theme.palette.grey[900]
           : theme.palette.grey[50],
       fontWeight: "normal",
       fontSize: "12px",
     }),
   },
   muiTableHeadCellProps: {
     sx: {
       fontWeight: "normal",
       fontSize: "12px",
     },
   },
 });

 return <MaterialReactTable table={table} />;
}

export default CollegeList