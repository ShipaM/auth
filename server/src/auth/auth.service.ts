import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { User } from '@prisma/client';

@Injectable() // Декоратор делает класс доступным для внедрения зависимостей (DI) в NestJS
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // Внедряем UserService через конструктор, чтобы использовать его методы (например, для создания пользователя)
  constructor(private readonly userService: UserService) {}

  /**
   * Метод регистрации пользователя.
   * Принимает DTO с данными от клиента (валидация уже выполнена),
   * и передаёт эти данные в UserService для создания нового пользователя в базе данных.
   * @param registerDto - объект с данными регистрации
   * @returns результат создания пользователя (обычно - созданный пользователь)
   */
  register(registerDto: RegisterDto) {
    const createUserDto = registerDto;

    delete createUserDto.repeatPassword;

    const createdUser = this.userService.create(createUserDto);

    return createdUser;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user: User = await this.userService
      .findByUsername(username)
      .catch((err) => {
        this.logger.error('Error while finding user by username', err);

        return null;
      });

    const isPasswordMatch = user && compareSync(password, user.password);

    if (!user || !isPasswordMatch) {
      const message = 'Incorrect login or password';
      this.logger.error(message);
      throw new UnauthorizedException(message);
    }

    return user;
  }
}
