import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController], // Регистрируем контроллер, который обрабатывает HTTP-запросы (например, регистрация, логин)
  providers: [AuthService], // Регистрируем сервис, где находится бизнес-логика (например, работа с пользователями и базой данных)
  imports: [UserModule, JwtModule.registerAsync({}), PassportModule],
})
export class AuthModule {}
