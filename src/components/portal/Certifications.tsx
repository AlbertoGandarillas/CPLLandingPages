import React, { useState, useEffect, useRef, useCallback } from "react";
import SearchBar from "../shared/SearchBar";
import { useCertifications } from "@/hooks/useCertifications";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import SelectCPLType from "./SelectCPLType";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "../ui/table";
import { ColumnDef, flexRender, getSortedRowModel, getCoreRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import CertificationCard from "./CertificationCard";
import { ViewCPLCertifications } from "@prisma/client";

import { ScrollArea } from "../ui/scroll-area";

interface CertificationsProps {
  onSelect: (IndustryCertification: string | null) => void;
}

export const Certifications = ({ onSelect }: CertificationsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cplType, setCplType] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSearch = useCallback((term: string) => {
    if (term.length >= 3 || term.length === 0) {
      setSearchTerm(term);
    }
  }, []);
  
  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error 
  } = useCertifications(searchTerm, cplType);

  const allCertifications = data?.pages.flatMap(page => page.items) ?? [];
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const columns: ColumnDef<ViewCPLCertifications>[] = [
    {
      accessorKey: "IndustryCertification",
      size: 300,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Certification
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-left">
          {row.getValue("IndustryCertification")}
        </div>
      ),
    },
    {
      accessorKey: "CPLType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            CPL Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center w-[100px]">{row.getValue("CPLType")}</div>
      ),
    },
    {
      accessorKey: "TotalUnits",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Units
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center w-[100px]">
          {row.getValue("TotalUnits")}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: allCertifications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  if (isLoading) {
    return <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />;
  }

  if (error) {
    console.error("Error loading CPL Certifications:", error);
    return <div>Error loading CPL Certifications</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-4 pb-4">
        <div className="w-96">
          <SelectCPLType selectedType={cplType} setSelectedType={setCplType} />
        </div>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search CPL Certifications by name..."
          className="w-full"
        />
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {allCertifications?.map((certification, index) => (
          <React.Fragment
            key={`${certification.CollegeViews[0].College}-${index}`}
          >
            <CertificationCard certification={certification} />
            {index === allCertifications.length - 1 && (
              <div ref={observerTarget} className="h-4" />
            )}
          </React.Fragment>
        ))}
        {isFetchingNextPage && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
            <SkeletonWrapper isLoading={true} fullWidth={true} variant="card" />
          </div>
        )}
      </div>
    </div>
  );
};
