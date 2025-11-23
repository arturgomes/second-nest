import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

/**
 * Data Transfer Object for updating a post.
 * 
 * PARTIAL TYPE UTILITY:
 * PartialType is a utility from @nestjs/mapped-types that:
 * 1. Makes all properties optional
 * 2. Inherits all validation decorators from the parent DTO
 * 3. Maintains type safety
 * 
 * This is perfect for PATCH operations where you only update specific fields.
 */
export class UpdatePostDto extends PartialType(CreatePostDto) { }
