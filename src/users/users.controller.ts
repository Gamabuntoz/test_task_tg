import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAccessAuthGuard } from '../security/guards/jwt-access-auth.guard';
import { AllUsersDTO } from './dto/all-users.dto';
import { QueryDTO } from './dto/query.dto';
import { GetUserDTO } from './dto/get-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessAuthGuard)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: `Get all users` })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AllUsersDTO,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token incorrect or was expired',
  })
  async findAllUsers(@Query() queryDTO: QueryDTO) {
    const allUsers = await this.usersService.findAllUsers(queryDTO);
    return allUsers.map((u) => this.usersService.createUserUI(u));
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiOperation({ summary: 'Creat new user' })
  @ApiBody({
    type: CreateUserDTO,
    required: true,
    description: 'Data for create user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: GetUserDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Incorrect input data',
  })
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this.usersService.createNewUser(createUserDTO);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: `Get user by id` })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: GetUserDTO,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token incorrect or was expired',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async findUserById(@Param('id') id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.createUserUI(user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: `Update user by id` })
  @ApiParam({ name: 'id' })
  @ApiBody({
    type: UpdateUserDTO,
    required: true,
    description: 'Data for update',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token incorrect or was expired',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async updateUserById(
    @Param('id') id: number,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return await this.usersService.updateUserById(id, updateUserDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: `Delete user by id` })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token incorrect or was expired',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async deleteUserById(@Param('id') id: number) {
    return await this.usersService.deleteUserById(id);
  }
}
