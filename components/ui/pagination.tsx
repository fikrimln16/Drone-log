"use client";

type Props = {
  currentPage: number;

  totalPages: number;

  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  // LIMIT PAGE BUTTON
  const visiblePages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).slice(
    Math.max(currentPage - 2, 0),
    Math.min(currentPage + 1, totalPages)
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* INFO */}
      <p className="text-center text-sm text-gray-500 md:text-left">
        Page{" "}
        <span className="font-semibold text-black">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-black">
          {totalPages}
        </span>
      </p>

      {/* BUTTONS */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* PREVIOUS */}
        <button
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className="rounded-xl border bg-white px-4 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {/* PAGE */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() =>
              onPageChange(page)
            }
            className={`h-10 w-10 rounded-xl border text-sm font-medium transition ${
              currentPage === page
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        {/* NEXT */}
        <button
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          className="rounded-xl border bg-white px-4 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}