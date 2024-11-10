import { Pagination } from './constants';
import { PaginationOption } from './types';

export const extractTakeAndSkipFrom = (options?: PaginationOption) => {
  const page = options?.page || Pagination.DEFAULT_PAGE;
  const itemsPerPage = options?.itemsPerPage || Pagination.DEFAULT_ITEM_PER_PAGE;

  return {
    take: itemsPerPage,
    skip: (page - 1) * itemsPerPage,
  }
};
