import { Token } from '@prisma/client';

export type Tokens = {
  accessToken: string;
  refreshToken: Token;
};

export type CookieOptions = {
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  secure: boolean;
  path: string;
  expires: Date;
};
