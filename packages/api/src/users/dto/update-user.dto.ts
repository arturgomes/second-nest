import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object for updating a user.
 * It extends CreateUserDto but makes all fields optional using PartialType.
 * This allows updating only specific fields without sending the entire object.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) { }
