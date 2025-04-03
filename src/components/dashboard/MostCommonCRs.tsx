import React, { useState, useMemo, useRef, useEffect } from "react";
import { useMostCommonCRs } from "@/hooks/useMostCommonCRs";
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

interface MostCommonCRsProps {
  onSelect: (Criteria: string | null) => void;
  catalogYearId?: string | null;
}

type SortOrder = "asc" | "desc";

interface CRData {
  ID: number;
  Criteria: string | null;
  Count: number | null;
  CollegeRecordCountString: string | null;
}

export const MostCommonCRs = ({
  onSelect,
  catalogYearId,
}: MostCommonCRsProps) => {
  const [filterValue, setFilterValue] = useState("");
  const { data, isLoading, error } = useMostCommonCRs(catalogYearId);
  const [sortField, setSortField] = useState<"Criteria" | "Count">("Count");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [displayedData, setDisplayedData] = useState<CRData[]>([]);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  const itemsPerPage = 20;

  const filteredAndSortedData = useMemo(() => {
    const filtered = data?.filter(
      (item) =>
        item.Criteria &&
        item.Criteria.toLowerCase().includes(filterValue.toLowerCase())
    ) || [];

    return [...filtered].sort((a, b) => {
      if (sortField === "Criteria") {
        const comparison = (a.Criteria || "").localeCompare(b.Criteria || "");
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

  const handleSort = (field: "Criteria" | "Count") => {
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
    console.error("Error loading Most Common CRs:", error);
    return <div>Error loading Most Common CRs</div>;
  }

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter credit recommendations..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="w-full"
        />
      </div>
      <TableContainer component={Paper} sx={{ maxHeight: "300px" }}>
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
                  active={sortField === "Criteria"}
                  direction={sortField === "Criteria" ? sortOrder : "asc"}
                  onClick={() => handleSort("Criteria")}
                >
                  Credit Recommendation
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
                onClick={() => onSelect(row.Criteria)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
              >
                <TableCell sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}>
                  {row.Criteria}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)", width: "150px" }}
                  title={`${row.CollegeRecordCountString}`}
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
