import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object for user login.
 * 
 * AUTHENTICATION DTO:
 * This DTO defines the credentials required for login.
 * It's separate from CreateUserDto to keep authentication concerns isolated.
 */
export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
