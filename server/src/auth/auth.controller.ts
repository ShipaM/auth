import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './guards/jwt-auth-guards';
import { Response } from 'express';
import { TokenService } from '@token/token.service';

@Public()
@Controller('auth') // Базовый маршрут для контроллера — все маршруты будут начинаться с /auth
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService, // Внедряем AuthService для вызова бизнес-логики
    private readonly tokenService: TokenService
  ) {}

  @Post('register') // Обрабатывает POST-запрос на /auth/register
  async register(@Body() registerDto: RegisterDto) {
    const createUser = await this.authService.register(registerDto); // Вызываем сервис для регистрации пользователя

    if (!createUser) {
      const message = 'Error while registration user';
      this.logger.error(message);
      throw new BadRequestException(message);
    }
    return createUser;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto);

    if (!tokens) {
      const message = 'Error while login user';
      this.logger.error(message);
      throw new BadRequestException(message);
    }

    const { refreshToken, accessToken } = tokens;
    this.tokenService.setRefreshTokenCookie(tokens, res);

    return res.status(HttpStatus.CREATED).json({ accessToken });
  }
}
