import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (start > 2) pages.unshift(-1);
  if (start > 1) pages.unshift(1);
  if (end < totalPages - 1) pages.push(-1);
  if (end < totalPages) pages.push(totalPages);

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'p-2 rounded-lg transition-all duration-150',
            currentPage <= 1
              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-400 hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((page, i) =>
          page === -1 ? (
            <span key={`ellipsis-${i}`} className="px-2 text-xs text-gray-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'min-w-[32px] h-8 rounded-lg text-xs font-medium transition-all duration-150',
                page === currentPage
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary'
              )}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            'p-2 rounded-lg transition-all duration-150',
            currentPage >= totalPages
              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-400 hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
