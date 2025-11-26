/**
 * Paginated Response Wrapper
 * 
 * GENERIC TYPE:
 * This class uses TypeScript generics to work with any data type.
 * Example: PaginatedResponse<User>, PaginatedResponse<Post>
 * 
 * RESPONSE STRUCTURE:
 * {
 *   "data": [...],
 *   "meta": {
 *     "total": 100,
 *     "page": 1,
 *     "limit": 10,
 *     "totalPages": 10,
 *     "hasNextPage": true,
 *     "hasPreviousPage": false
 *   }
 * }
 */
export class PaginatedResponse<T> {
  /**
   * Array of items for the current page
   */
  data: T[];

  /**
   * Pagination metadata
   */
  meta: {
    /**
     * Total number of items across all pages
     */
    total: number;

    /**
     * Current page number (1-indexed)
     */
    page: number;

    /**
     * Number of items per page
     */
    limit: number;

    /**
     * Total number of pages
     */
    totalPages: number;

    /**
     * Whether there is a next page
     */
    hasNextPage: boolean;

    /**
     * Whether there is a previous page
     */
    hasPreviousPage: boolean;

    /**
     * Cursor for the next page (cursor-based pagination)
     * This is the ID of the last item in the current page
     */
    nextCursor?: string;
  };

  /**
   * Constructor to create a paginated response
   * 
   * @param data - Array of items
   * @param total - Total count of items
   * @param page - Current page number
   * @param limit - Items per page
   * @param nextCursor - Optional cursor for next page
   */
  constructor(data: T[], total: number, page: number, limit: number, nextCursor?: string) {
    this.data = data;

    const totalPages = Math.ceil(total / limit);

    this.meta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextCursor,
    };
  }
}
