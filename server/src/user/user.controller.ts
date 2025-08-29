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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('find-one/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('find-by-username/:username')
  async findByUsername(@Param('username') username: string) {
    const user: User = await this.userService.findByUsername(username);

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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
