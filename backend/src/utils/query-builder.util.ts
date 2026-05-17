import { LeadStatus, LeadSource } from '../constants/enums';

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const buildLeadFilter = (
  filters: LeadFilters,
  userId: string,
  userRole?: string
): Record<string, unknown> => {
  const query: Record<string, unknown> = {};

  // Admin sees all leads, sales users see only their own
  if (userRole !== 'admin') {
    query.owner = userId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
    ];
  }

  return query;
};

export const getSortOptions = (sort?: 'latest' | 'oldest'): Record<string, 1 | -1> => {
  if (sort === 'oldest') {
    return { createdAt: 1 };
  }
  return { createdAt: -1 };
};

export const calculatePagination = (
  total: number,
  page: number,
  limit: number
): { total: number; page: number; limit: number; totalPages: number } => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};