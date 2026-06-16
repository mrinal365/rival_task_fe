import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-[#e5e8ef] px-6 py-3.5 flex items-center justify-between shadow-[0_-4px_12px_rgba(10,21,48,0.06)]">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-xl border border-[#e5e8ef] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3d4a66] transition-colors cursor-pointer ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-zinc-50"
            }`}
        >
          Previous
        </button>

        <span className="text-xs font-bold text-[#0f172a] bg-zinc-50 border border-[#e5e8ef] px-2.5 py-1 rounded-lg">
          Page {currentPage}
        </span>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center rounded-xl border border-[#e5e8ef] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3d4a66] transition-colors cursor-pointer ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-zinc-50"
            }`}
        >
          Next
        </button>
      </div>

      {/* Desktop/Tablet Inline Pagination Bar */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mt-6 px-1 py-3 bg-transparent">
        <div>
          <p className="text-xs text-[#6b7890]">
            Showing page <span className="font-semibold text-[#0f172a]">{currentPage}</span> of{" "}
            <span className="font-semibold text-[#0f172a]">{totalPages}</span> pages
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-xl shadow-[0_1px_2px_rgba(10,21,48,0.01)]"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-xl px-3 py-2 text-[#6b7890] border border-[#e5e8ef] bg-white hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 cursor-pointer transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <span className="sr-only">Previous</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === currentPage;
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 text-xs font-semibold focus:z-20 transition-all border border-[#e5e8ef] cursor-pointer ${isActive
                      ? "z-10 bg-[#2957ff] text-white border-[#2957ff] hover:bg-[#1b43d6]"
                      : "bg-white text-[#3d4a66] hover:bg-zinc-50"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-xl px-3 py-2 text-[#6b7890] border border-[#e5e8ef] bg-white hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 cursor-pointer transition-colors ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <span className="sr-only">Next</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Pagination;
