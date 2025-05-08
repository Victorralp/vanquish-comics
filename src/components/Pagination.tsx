'use client';

import { useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5
}: PaginationProps) {
  // Calculate which page numbers to show
  const paginationNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
      
      if (endPage - startPage < maxVisiblePages - 3) {
        startPage = Math.max(2, endPage - (maxVisiblePages - 3));
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex flex-wrap justify-center items-center space-x-2">
      <button 
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`flex items-center px-4 py-2 rounded-lg ${
          currentPage === 1 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
        aria-label="Previous page"
      >
        <FiChevronLeft className="mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </button>
      
      {/* Page Numbers */}
      <div className="flex items-center space-x-2 mx-2">
        {paginationNumbers.map((page, index) => 
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                currentPage === page 
                  ? 'bg-yellow-500 text-gray-900 font-bold' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>
      
      <button 
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`flex items-center px-4 py-2 rounded-lg ${
          currentPage === totalPages 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <FiChevronRight className="ml-1" />
      </button>
    </div>
  );
} 