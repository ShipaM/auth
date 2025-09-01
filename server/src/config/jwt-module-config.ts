import { ConfigService } from '@nestjs/config'; // Импорт сервиса конфигурации для доступа к env-переменным
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
// Импорт типов опций для настройки JwtModule — синхронных и асинхронных

// Функция, которая принимает ConfigService и возвращает объект конфигурации для JwtModule
const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get('JWT_SECRET'), // Секретный ключ для подписи JWT, берется из env (например, process.env.JWT_SECRET)
  signOptions: {
    expiresIn: config.get('JWT_EXPIRES', '5m'), // Время жизни токена, по умолчанию 5 минут (если переменная не задана)
  },
});

// Экспортируем объект опций для асинхронной регистрации JwtModule
export const jwtModuleAsyncOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService], // Внедряем ConfigService в фабричную функцию
  useFactory: (config: ConfigService) => jwtModuleOptions(config), // Фабричная функция, возвращающая конфигурацию JwtModule
});
