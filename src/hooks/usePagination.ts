import { useState } from "react";

export type TMetaData = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

const usePagination = ({ metaData, noOfItemPerPage = 10 }: { metaData?: TMetaData; noOfItemPerPage?: number }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const metadata: TMetaData = metaData || {
    page: 1,
    limit: noOfItemPerPage,
    total: 0,
    totalPage: 1,
  };

  const itemsPerPage = noOfItemPerPage;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= metadata.totalPage) {
      setCurrentPage(page);
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < metadata.totalPage) {
      setCurrentPage((p) => p + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;
    const totalPages = metadata.totalPage;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const startIndex = metadata.total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, metadata.total);

  return {
    currentPage,
    setCurrentPage,
    goToNext,
    goToPrevious,
    goToPage,
    getPageNumbers,
    startIndex,
    endIndex,
    itemsPerPage,
    metadata,
  };
};

export default usePagination;
