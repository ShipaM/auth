export const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
  allowedHeaders: [
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Requested-With',
    'Origin',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
