import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from 'src/config/jwt-module-config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth-guards';
import { TokenModule } from '@token/token.module';

@Module({
  controllers: [AuthController], // Регистрируем контроллер, который обрабатывает HTTP-запросы (например, регистрация, логин)
  providers: [AuthService, JwtStrategy, JwtAuthGuard], // Регистрируем сервис, где находится бизнес-логика (например, работа с пользователями и базой данных)
  imports: [
    UserModule,
    JwtModule.registerAsync(jwtModuleAsyncOptions()),
    PassportModule,
    TokenModule,
  ],
})
export class AuthModule {}
