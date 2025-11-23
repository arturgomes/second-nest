import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UsersController - HTTP Request Handler for User Operations
 * 
 * DESIGN PATTERN: Controller Pattern (MVC)
 * Controllers handle incoming HTTP requests and return responses to the client.
 * They delegate business logic to services, following the Separation of Concerns principle.
 * 
 * ROUTE PREFIX:
 * @Controller('users') sets the base route to '/users'
 * All methods in this controller will be prefixed with '/users'
 */
@Controller('users')
export class UsersController {
  /**
   * Constructor-based Dependency Injection
   * 
   * The UsersService is automatically injected by NestJS's IoC container.
   * This promotes loose coupling and makes testing easier (we can mock the service).
   */
  constructor(private readonly usersService: UsersService) { }

  /**
   * POST /users - Create a new user
   * 
   * HTTP METHOD DECORATORS:
   * @Post() maps this method to HTTP POST requests
   * 
   * REQUEST BODY BINDING:
   * @Body() decorator extracts the request body and validates it against CreateUserDto
   * NestJS automatically validates the DTO using class-validator decorators
   * 
   * @param createUserDto - Validated user creation data from request body
   * @returns Promise<User> - The created user (201 Created)
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users - Retrieve all users
   * 
   * @Get() with no argument maps to the base route '/users'
   * 
   * @returns Promise<User[]> - Array of all users (200 OK)
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id - Retrieve a specific user by ID
   * 
   * ROUTE PARAMETERS:
   * @Param('id') extracts the 'id' from the URL path
   * 
   * PIPES FOR TRANSFORMATION:
   * ParseIntPipe automatically converts the string parameter to a number
   * It also validates that the parameter is a valid integer
   * If validation fails, it throws a BadRequestException (400)
   * 
   * @param id - User ID from URL parameter
   * @returns Promise<User> - The found user (200 OK)
   * @throws NotFoundException - If user doesn't exist (404)
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id - Update a user
   * 
   * HTTP METHOD SEMANTICS:
   * PATCH is used for partial updates (vs PUT for full replacement)
   * 
   * MULTIPLE DECORATORS:
   * We can combine @Param() and @Body() to get data from different sources
   * 
   * @param id - User ID from URL parameter
   * @param updateUserDto - Partial user data from request body
   * @returns Promise<User> - The updated user (200 OK)
   * @throws NotFoundException - If user doesn't exist (404)
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id - Delete a user
   * 
   * @param id - User ID from URL parameter
   * @returns Promise<User> - The deleted user (200 OK)
   * @throws NotFoundException - If user doesn't exist (404)
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
