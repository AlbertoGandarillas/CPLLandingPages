import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handleFirst = () => onPageChange(1);
  const handlePrevious = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));
  const handleLast = () => onPageChange(totalPages);
  return (
    <div className="flex justify-end gap-1">
      <Button
        onClick={handleFirst}
        variant="secondary"
        disabled={currentPage === 1}
      >
        <ChevronFirst size={16} />
      </Button>
      <Button
        onClick={handlePrevious}
        variant="secondary"
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </Button>
      <Button
        onClick={handleNext}
        variant="secondary"
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </Button>
      <Button
        onClick={handleLast}
        variant="secondary"
        disabled={currentPage === totalPages}
      >
        <ChevronLast size={16} />
      </Button>
    </div>
  );
}
