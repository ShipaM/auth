import { Controller, Get, Res, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { Public } from '@auth/guards/jwt-auth-guards';
import { Cookies } from '@decorators/cookies.decorator';
import { Response } from 'express';

const { REFRESH_TOKEN } = process.env;

@Public()
@Controller('token')
export class TokenController {
  private readonly refreshToken: string;
  constructor(private readonly tokenService: TokenService) {}
  @Get('refresh-tokens')
  async refreshTokens(
    @Cookies(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.tokenService.refreshTokens(refreshToken);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.tokenService.setRefreshTokenCookie(tokens, res);
  }
}
