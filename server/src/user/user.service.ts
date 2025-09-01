import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
// Импорт стандартных исключений и утилит из NestJS

import { CreateUserDto } from './dto/create-user.dto';
// DTO для создания пользователя — структура ожидаемых данных

import { UpdateUserDto } from './dto/update-user.dto';
// DTO для обновления пользователя — структура для обновления

import { PrismaService } from '@prisma/prisma.service';
// Сервис для работы с базой данных через Prisma ORM

import { genSaltSync, hashSync } from 'bcrypt';
// Функции для хеширования пароля с солью

@Injectable()
// Декоратор, который делает класс доступным для внедрения зависимостей в NestJS
export class UserService {
  private readonly logger = new Logger(UserService.name);
  // Создаём логгер для вывода сообщений об ошибках и важной информации

  constructor(private readonly prismaService: PrismaService) {}
  // Внедряем PrismaService для работы с БД

  private hashPassword(password: string) {
    // Приватный метод для хеширования пароля с использованием bcrypt и соли
    return hashSync(password, genSaltSync(10));
  }

  async create(createUserDto: CreateUserDto) {
    // Метод создания нового пользователя
    const hashedPassword = this.hashPassword(createUserDto.password);
    // Хешируем пароль из DTO

    const userData = { ...createUserDto, password: hashedPassword };
    // Создаём объект для записи в базу с заменённым паролем

    // Проверяем, нет ли пользователя с таким email
    const existingUserByEmail = await this.findByEmail(createUserDto.email);
    if (existingUserByEmail) {
      const message = 'User with this email already exists';
      this.logger.error(message);
      throw new ConflictException(message);
    }

    // Проверяем, нет ли пользователя с таким userName
    const existingUserByUsername = await this.findByUserName(
      createUserDto.userName
    );
    if (existingUserByUsername) {
      const message = 'User with this user name already exists';
      this.logger.error(message);
      throw new ConflictException(message);
    }

    // Проверяем, нет ли пользователя с таким телефоном
    const existingUserByPhone = await this.findByPhone(createUserDto.phone);
    if (existingUserByPhone) {
      const message = 'User with this phone already exists';
      this.logger.error(message);
      throw new ConflictException(message);
    }

    // Создаём пользователя в базе данных через Prisma
    const newUser = await this.prismaService.user
      .create({
        data: userData,
      })
      .catch((error) => {
        this.logger.error('Error while registering new user', error);
        throw new BadRequestException('Error while registering new user!');
      });

    delete newUser.password; // Удаляем пароль из объекта перед отправкой клиенту

    return newUser;
  }

  async findAll() {
    // Возвращает всех пользователей из базы
    return await this.prismaService.user.findMany();
  }

  async findById(id: string) {
    // Ищет пользователя по ID
    if (!id) {
      this.logger.error('ID is undefined');
      throw new NotFoundException("User doesn't exist with this id");
    }
    try {
      const foundedUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!foundedUser) return null;

      return foundedUser;
    } catch (error) {
      this.logger.error('Error while finding user by id', error);
      throw new NotFoundException("User doesn't exist with this id");
    }
  }

  async findByUserName(userName: string) {
    // Ищет пользователя по userName
    try {
      const foundedUser = await this.prismaService.user.findUnique({
        where: { userName },
      });

      if (!foundedUser) return null;

      return foundedUser;
    } catch (error) {
      this.logger.error('Error while finding user by user name', error);
      throw new NotFoundException("User doesn't exist with this user name");
    }
  }

  async findByEmail(email: string) {
    // Ищет пользователя по email
    return this.prismaService.user
      .findUnique({ where: { email } })
      .then((foundedUser) => {
        if (!foundedUser) {
          return null;
        }
        return foundedUser;
      })
      .catch((err) => {
        this.logger.error('Error while finding user by email', err);
        throw new NotFoundException("User doesn't exist with this email");
      });
  }

  async findByPhone(phone: string) {
    // Ищет пользователя по телефону
    return this.prismaService.user
      .findUnique({ where: { phone } })
      .then((foundedUser) => {
        if (!foundedUser) {
          return null;
        }
        return foundedUser;
      })
      .catch((err) => {
        this.logger.error('Error while finding user by phone number!', err);
        throw new NotFoundException(
          'Error while finding user by phone number!'
        );
      });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Обновляет пользователя с заданным id, изменяя поля согласно DTO
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    // Удаляет пользователя по id
    return await this.prismaService.user
      .delete({ where: { id } })
      .then((deletedUser) => {
        return { message: 'User successfully deleted', deletedUser };
      })
      .catch((err) => {
        throw new Error(`Error while deleting user: ${err.message}`);
      });
  }
}
