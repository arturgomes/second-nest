import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

/**
 * Pagination Query DTO
 * 
 * PAGINATION PATTERN:
 * This DTO defines query parameters for pagination.
 * It uses offset-based pagination (page + limit).
 * 
 * ALTERNATIVE APPROACHES:
 * - Cursor-based pagination (better for large datasets)
 * - Keyset pagination (most efficient for sorted data)
 * 
 * QUERY PARAMETERS:
 * GET /users?page=1&limit=10
 */
export class PaginationDto {
  /**
   * Page number (1-indexed)
   * Default: 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * Number of items per page
   * Default: 10
   * Max: 100 (prevents excessive data fetching)
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  /**
   * Calculate skip value for database query
   * 
   * OFFSET CALCULATION:
   * skip = (page - 1) * limit
   * Example: page=2, limit=10 → skip=10
   */
  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10);
  }
}
