import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  getPageNumbers: () => (number | string)[];
  goToPage: (page: number) => void;
  goToPrevious: () => void;
  goToNext: () => void;
}

const CustomPagination = ({ currentPage, totalPages, isLoading = false, getPageNumbers, goToPage, goToPrevious, goToNext }: PaginationProps) => {
  // if (totalPages <= 1) return null; // hide if only 1 page

  return (
    <div className="flex items-center space-x-1">
      {/* Previous button */}
      <button
        onClick={goToPrevious}
        disabled={currentPage === 1 || isLoading}
        className={`flex items-center px-3 py-2 text-sm rounded-md cursor-pointer ${
          currentPage === 1 || isLoading ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <ChevronLeft size={16} className="mr-1" /> Previous
      </button>

      {/* Page numbers */}
      <div className="flex space-x-1">
        {getPageNumbers().map((pageNumber, idx) =>
          pageNumber === "..." ? (
            <span key={idx} className="px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => goToPage(pageNumber as number)}
              disabled={isLoading}
              className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                currentPage === pageNumber ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>

      {/* Next button */}
      <button
        onClick={goToNext}
        disabled={currentPage === totalPages || isLoading}
        className={`flex items-center px-3 py-2 text-sm rounded-md cursor-pointer ${
          currentPage === totalPages || isLoading ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        Next <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default CustomPagination;
