import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt } from 'class-validator';

/**
 * Data Transfer Object for creating a new post.
 * 
 * DTOs serve multiple purposes:
 * 1. Type safety - ensures data has the correct structure
 * 2. Validation - validates incoming data before it reaches the service layer
 * 3. Documentation - clearly defines what data is expected
 * 4. Decoupling - separates API contract from database models
 */
export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  /**
   * Author ID - Foreign Key Reference
   * 
   * RELATIONAL DATA:
   * This establishes the relationship between Post and User.
   * The @IsInt() validator ensures we receive a valid user ID.
   */
  @IsString({ message: 'Author ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Author ID is required' })
  authorId: string;
}
