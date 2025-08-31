import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { Public } from '@auth/guards/jwt-auth-guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('find-all')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('find-by-id/:id')
  async findById(@Param('id') id: string) {
    const user: User = await this.userService.findById(id);

    delete user.password;

    return user;
  }

  @Get('find-by-user-name/:userName')
  async findByUserName(@Param('userName') userName: string) {
    const user: User = await this.userService.findByUserName(userName);

    delete user.password;

    return user;
  }

  @Get('find-by-email/:email')
  async findByEmail(@Param('email') email: string) {
    const user: User = await this.userService.findByEmail(email);
    delete user.password;
    return user;
  }

  @Get('find-by-phone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    const user: User = await this.userService.findByPhone(phone);

    delete user.password;

    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
