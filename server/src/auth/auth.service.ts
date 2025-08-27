import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RegisterDto } from './register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  register(registerDto: RegisterDto) {
    const { username, email, password, phone, firstName, lastName } =
      registerDto;

    return this.prismaService.user.create({
      data: {
        username,
        email,
        password,
        phone,
        firstName,
        lastName,
      },
    });
  }
}
