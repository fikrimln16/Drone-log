"use client";

import { useMemo, useState } from "react";

export default function usePagination(data: any[], itemsPerPage: number = 7) {
  const [currentPage, setCurrentPage] = useState(1);

  // TOTAL PAGE
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // PAGINATED DATA
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    const end = start + itemsPerPage;

    return data.slice(start, end);
  }, [data, currentPage, itemsPerPage]);

  return {
    paginatedData,

    currentPage,
    setCurrentPage,

    totalPages,
  };
}
