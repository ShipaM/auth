export const corsOptions = {
  // Список разрешённых источников (домены, с которых можно делать запросы)
  origin: ['http://localhost:5173', 'http://localhost:5000'],

  // Разрешённые HTTP методы, которые можно использовать при запросах
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

  // Заголовки, которые разрешено отправлять в запросах
  allowedHeaders: [
    'Content-Type', // Тип содержимого (например, application/json)
    'Accept', // Какие форматы ответа клиент принимает
    'Authorization', // Для передачи токенов авторизации (например JWT)
    'X-Requested-With', // Часто используется для AJAX-запросов
    'Origin', // Заголовок с источником запроса
  ],

  // Разрешать отправлять куки и авторизационные заголовки
  credentials: true,

  // Статус, который возвращается на успешный OPTIONS-запрос (предварительный запрос CORS)
  optionsSuccessStatus: 200,
};
