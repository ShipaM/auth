import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Базовый маршрут для контроллера — все маршруты будут начинаться с /auth
export class AuthController {
  constructor(
    private readonly authService: AuthService // Внедряем AuthService для вызова бизнес-логики
  ) {}

  // Обрабатывает POST-запрос на /auth/register
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    const createUser = this.authService.register(registerDto); // Вызываем сервис для регистрации пользователя

    return createUser;
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const user = this.authService.login(loginDto);
    return user;
  }
}
