import { Role } from '@prisma/client';

export type AccessToken = {
  userId: string;
  userName: string;
  email: string;
  role: Role[];
};

export type JWTPayload = AccessToken;
