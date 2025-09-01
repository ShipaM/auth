import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
// Импорт декораторов из NestJS для описания маршрутов и параметров

import { UserService } from './user.service';
// Сервис для работы с пользователями — бизнес-логика

import { CreateUserDto } from './dto/create-user.dto';
// DTO для создания пользователя — описывает ожидаемые данные при создании

import { UpdateUserDto } from './dto/update-user.dto';
// DTO для обновления пользователя — описывает поля, которые можно менять

import { User } from '@prisma/client';
// Тип User из Prisma ORM

import { Public } from '@auth/guards/jwt-auth-guards';
// Декоратор для пометки публичных (не защищённых) маршрутов, если используется Guard

@Controller('user') // Базовый путь для всех маршрутов в контроллере — /user
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Внедрение UserService через конструктор для вызова методов бизнес-логики

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Обрабатывает POST-запрос на /user для создания пользователя
    // В теле запроса ожидается объект с данными, описанными в CreateUserDto
    return this.userService.create(createUserDto);
  }

  @Get('find-all')
  async findAll() {
    // Обрабатывает GET-запрос на /user/find-all для получения списка всех пользователей
    return await this.userService.findAll();
  }

  @Get('find-by-id/:id')
  async findById(@Param('id') id: string) {
    // Обрабатывает GET-запрос на /user/find-by-id/:id, где :id — параметр URL
    // Ищет пользователя по id и возвращает его без пароля
    const user: User = await this.userService.findById(id);

    delete user.password; // Удаляем поле password из объекта перед отправкой клиенту

    return user;
  }

  @Get('find-by-user-name/:userName')
  async findByUserName(@Param('userName') userName: string) {
    // Обрабатывает GET-запрос на /user/find-by-user-name/:userName
    // Находит пользователя по userName, удаляет пароль и возвращает
    const user: User = await this.userService.findByUserName(userName);

    delete user.password;

    return user;
  }

  @Get('find-by-email/:email')
  async findByEmail(@Param('email') email: string) {
    // Обрабатывает GET-запрос на /user/find-by-email/:email
    // Ищет пользователя по email, удаляет пароль и возвращает
    const user: User = await this.userService.findByEmail(email);
    delete user.password;
    return user;
  }

  @Get('find-by-phone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    // Обрабатывает GET-запрос на /user/find-by-phone/:phone
    // Ищет пользователя по номеру телефона, удаляет пароль и возвращает
    const user: User = await this.userService.findByPhone(phone);

    delete user.password;

    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Обрабатывает PATCH-запрос на /user/:id
    // Обновляет данные пользователя с указанным id на основе пришедших полей из тела запроса
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Обрабатывает DELETE-запрос на /user/:id
    // Удаляет пользователя с указанным id
    return await this.userService.remove(id);
  }
}
