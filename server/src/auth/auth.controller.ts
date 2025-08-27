import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() RegisterDto: RegisterDto) {
    console.log(RegisterDto);
    return this.authService.register(RegisterDto);
  }

  @Post('login')
  login() {
    return 'login';
  }
}
