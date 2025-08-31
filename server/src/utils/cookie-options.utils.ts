import { CookieOptions } from '@token/types/type'; // Импорт интерфейса CookieOptions для типизации параметров cookie

/**
 * Функция для генерации стандартных параметров cookie с датой истечения срока действия.
 * @param expires - Дата истечения срока действия cookie.
 * @returns Объект с параметрами cookie, соответствующими стандартам безопасности.
 */

export const getCookieOptions = (expires: Date): CookieOptions => ({
  // Устанавливает cookie как доступное только через HTTP(S), предотвращая доступ через JavaScript.
  httpOnly: true,

  // Ограничивает отправку cookie только на тот же сайт, предотвращая атаки CSRF.
  sameSite: 'lax',

  // Указывает, что cookie будет отправляться только по защищенному протоколу HTTPS.
  secure: false,

  // Устанавливает путь, для которого cookie будет доступно.
  path: '/',

  // Устанавливает дату истечения срока действия cookie.
  expires,
});
