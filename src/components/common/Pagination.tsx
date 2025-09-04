import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxVisiblePages = 5 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calcular as páginas visíveis
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(maxVisiblePages, totalPages);
    } else if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const buttonClass = "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 text-sm font-medium";
  const activeClass = "bg-orange-500 text-white";
  const inactiveClass = "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white";
  const disabledClass = "bg-gray-800 text-gray-600 cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* First page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`}
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Previous page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="text-gray-400 px-2">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`${buttonClass} ${
                currentPage === page ? activeClass : inactiveClass
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonClass} ${currentPage === totalPages ? disabledClass : inactiveClass}`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${buttonClass} ${currentPage === totalPages ? disabledClass : inactiveClass}`}
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}