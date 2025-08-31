import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { UserService } from '@user/user.service';
import * as dayjs from 'dayjs';
import { Tokens, CookieOptions } from './types/type';
import { Response } from 'express';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly config: ConfigService
  ) {}
  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const token = await this.prismaService.token
      .delete({
        where: { token: refreshToken },
      })
      .catch((err) => null);

    const today = dayjs();
    const expDate = dayjs(token.expires);
    const isExpired = expDate.isBefore(today);

    if (!token.expires || isExpired) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(token.userId);

    return this.generateTokens(user);
  }

  generateTokens = async (user: User): Promise<Tokens> => {
    const accessToken = this.jwtService.sign({
      userId: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    });

    const refreshToken: Token = await this.getRefreshToken(user.id);

    const tokens = { accessToken, refreshToken };

    return tokens;
  };

  setRefreshTokenCookie(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    const { token, expires } = tokens.refreshToken;

    const cookieExpDate = dayjs(expires).toDate();

    const CookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      expires: cookieExpDate,
    };

    const refreshToken = this.config.get('REFRESH_TOKEN');

    res.cookie(refreshToken, token, CookieOptions);
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }

  private getRefreshToken = async (userId: string): Promise<Token> => {
    const currentDate = dayjs();

    const expirationUnit = this.config.get('TOKEN_EXPIRATION_UNIT');
    const expirationValue = this.config.get('TOKEN_EXPIRATION_VALUE');

    const expireDate = currentDate
      .add(expirationValue, expirationUnit)
      .toDate();

    return await this.prismaService.token.create({
      data: {
        token: v4(),
        expires: expireDate,
        userId,
      },
    });
  };
}
