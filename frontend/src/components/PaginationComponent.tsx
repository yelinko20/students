import React, { memo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrevious,
  nextPageUrl,
  previousPageUrl,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    const pageNeighbors = 2;

    const startPage = Math.max(2, currentPage - pageNeighbors);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbors);

    pages.push(
      <PaginationItem key={1}>
        <PaginationLink
          className={cn("cursor-pointer select-none")}
          isActive={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Add start ellipsis if needed
    if (startPage > 3) {
      pages.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            className={cn("cursor-pointer select-none")}
            isActive={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            className={cn("cursor-pointer select-none")}
            isActive={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          className={cn(
            "cursor-pointer select-none",
            previousPageUrl === null && "cursor-not-allowed opacity-50"
          )}
        >
          <PaginationPrevious onClick={onPrevious} />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem
          className={cn(
            "cursor-pointer select-none",
            nextPageUrl === null && "cursor-not-allowed opacity-50"
          )}
        >
          <PaginationNext onClick={onNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default memo(PaginationComponent);
