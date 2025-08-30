import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Создаём кастомный параметр-декоратор @Cookies() для контроллеров NestJS
export const Cookies = createParamDecorator(
  // Фабричная функция, принимающая ключ и контекст выполнения
  (key: string | undefined, ctx: ExecutionContext) => {
    // Получаем HTTP-контекст из ExecutionContext
    const request = ctx.switchToHttp().getRequest();

    // Извлекаем объект cookies из запроса (Express автоматически парсит их, если подключён cookie-parser)
    const cookies = request.cookies;

    // Если передан ключ — возвращаем значение конкретного cookie, иначе возвращаем все cookies
    return key ? cookies?.[key] : cookies;
  }
);
