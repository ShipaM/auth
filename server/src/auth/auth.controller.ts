import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { Cookies } from '@decorators/cookies.decorator';
import { ConfigService } from '@nestjs/config';
import { getCookieOptions } from '@utils/cookie-options.utils';

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

@Public()
@Controller('auth') // Базовый маршрут для контроллера — все маршруты будут начинаться с /auth
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService, // Внедряем AuthService для вызова бизнес-логики
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService
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

    this.tokenService.setRefreshTokenCookie(tokens, res);
  }

  @Get('logout')
  async logout(
    @Cookies(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }

    this.authService.deleteRefreshToken(refreshToken);

    const refreshTokenName = this.configService.get('REFRESH_TOKEN');
    const today = new Date();

    res.cookie(refreshTokenName, '', getCookieOptions(today));
    res.sendStatus(HttpStatus.OK);
  }
}
