import React, { useState, useMemo, useRef, useEffect } from "react";
import { useMostCommonCIDs } from "@/hooks/useMostCommonCIDs";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TableSortLabel,
} from "@mui/material";

interface MostCommonCIDsProps {
  onSelect: (CIDNumber: string | null) => void;
  catalogYearId?: string | null;
}

type SortOrder = "asc" | "desc";

interface CIDData {
  CIDNumber: string | null;
  CIDDescriptor: string | null;
  Count: number | null;
}

export const MostCommonCIDs = ({
  onSelect,
  catalogYearId,
}: MostCommonCIDsProps) => {
  const [filterValue, setFilterValue] = useState("");
  const { data, isLoading, error } = useMostCommonCIDs(catalogYearId);
  const [sortField, setSortField] = useState<"CIDNumber" | "CIDDescriptor" | "Count">("Count");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [displayedData, setDisplayedData] = useState<CIDData[]>([]);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  const itemsPerPage = 20;

  const filteredAndSortedData = useMemo(() => {
    const filtered = data?.filter(
      (item) =>
        item.CIDNumber &&
        item.CIDDescriptor &&
        (item.CIDNumber.toLowerCase().includes(filterValue.toLowerCase()) ||
         item.CIDDescriptor.toLowerCase().includes(filterValue.toLowerCase()))
    ) || [];

    return [...filtered].sort((a, b) => {
      if (sortField === "CIDNumber") {
        const comparison = (a.CIDNumber || "").localeCompare(b.CIDNumber || "");
        return sortOrder === "asc" ? comparison : -comparison;
      } else if (sortField === "CIDDescriptor") {
        const comparison = (a.CIDDescriptor || "").localeCompare(b.CIDDescriptor || "");
        return sortOrder === "asc" ? comparison : -comparison;
      } else {
        const comparison = (a.Count || 0) - (b.Count || 0);
        return sortOrder === "asc" ? comparison : -comparison;
      }
    });
  }, [data, filterValue, sortField, sortOrder]);

  useEffect(() => {
    setDisplayedData(filteredAndSortedData.slice(0, itemsPerPage));
    setPage(1);
  }, [filteredAndSortedData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextItems = filteredAndSortedData.slice(
            page * itemsPerPage,
            (page + 1) * itemsPerPage
          );
          if (nextItems.length > 0) {
            setDisplayedData((prev) => [...prev, ...nextItems]);
            setPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadingRef = loadingRef.current;

    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [page, filteredAndSortedData, itemsPerPage]);

  const handleSort = (field: "CIDNumber" | "CIDDescriptor" | "Count") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />
    );
  }

  if (error) {
    console.error("Error loading Most Common CIDs:", error);
    return <div>Error loading Most Common CIDs</div>;
  }

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter CIDs..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="w-full"
        />
      </div>
      <TableContainer component={Paper} sx={{ maxHeight: "380px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <TableSortLabel
                  active={sortField === "CIDNumber"}
                  direction={sortField === "CIDNumber" ? sortOrder : "asc"}
                  onClick={() => handleSort("CIDNumber")}
                >
                  CID Number
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <TableSortLabel
                  active={sortField === "CIDDescriptor"}
                  direction={sortField === "CIDDescriptor" ? sortOrder : "asc"}
                  onClick={() => handleSort("CIDDescriptor")}
                >
                  CID Descriptor
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                  width: "150px",
                }}
              >
                <TableSortLabel
                  active={sortField === "Count"}
                  direction={sortField === "Count" ? sortOrder : "asc"}
                  onClick={() => handleSort("Count")}
                >
                  Student Count
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData?.map((row, index) => (
              <TableRow 
                key={index}
                onClick={() => onSelect(row.CIDNumber)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
              >
                <TableCell sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}>
                  {row.CIDNumber}
                </TableCell>
                <TableCell sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}>
                  {row.CIDDescriptor}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)", width: "150px" }}
                >
                  {row.Count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div ref={loadingRef} style={{ height: "20px" }} />
      </TableContainer>
    </div>
  );
};
