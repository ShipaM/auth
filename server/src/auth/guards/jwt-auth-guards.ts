import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { SetMetadata } from '@nestjs/common';

// Константа для ключа метаданных, которая будет обозначать публичный маршрут
export const IS_PUBLIC_KEY = 'isPublic';

// Декоратор для пометки маршрута как публичного (не требующего авторизации)
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
// Кастомный Guard для JWT авторизации, расширяет стандартный AuthGuard с стратегией 'jwt'
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super(); // вызываем конструктор родителя AuthGuard
  }

  // Переопределяем canActivate, чтобы добавить проверку публичного маршрута
  canActivate(context: ExecutionContext) {
    // С помощью Reflector получаем метаданные 'isPublic' с текущего обработчика (метода) и класса (контроллера)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если маршрут помечен как публичный — пропускаем без проверки авторизации
    if (isPublic) {
      return true;
    }

    // Иначе вызываем стандартную проверку авторизации JWT
    return super.canActivate(context);
  }
}

// Декоратор @Public() можно вешать на контроллеры или методы, чтобы пометить их как открытые.

//JwtAuthGuard проверяет, есть ли этот декоратор — если да, то разрешает доступ без авторизации, если нет — требует JWT-токен.
