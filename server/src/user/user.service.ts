import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = this.hashPassword(createUserDto.password);

    const userData = { ...createUserDto, password: hashedPassword };

    const existingUserByEmail = await this.findByEmail(createUserDto.email);

    if (existingUserByEmail) {
      const message = 'User with this email already exists';
      this.logger.error(message);
      throw new ConflictException(message);
    }

    const existingUserByUsername = await this.findByUsername(
      createUserDto.username
    );

    if (existingUserByUsername) {
      const message = 'User with this username already exists';
      this.logger.error(message);
      throw new ConflictException(message);
    }

    const existingUserByPhone = await this.findByPhone(createUserDto.phone);

    if (existingUserByPhone) {
      const message = 'User with this phone already exists';
      this.logger.error(message);
      throw new ConflictException(message);
    }

    // Создаём нового пользователя в базе данных через Prisma
    const newUser = await this.prismaService.user
      .create({
        data: userData,
      })
      .catch((error) => {
        this.logger.error('Error while registering new user', error);
        throw new BadRequestException('Error while registering new user!');
      });

    // Удаляем пароль из response
    delete newUser.password;

    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async findByUsername(username: string) {
    try {
      const foundedUser = await this.prismaService.user.findUnique({
        where: { username },
      });

      if (!foundedUser) return null;

      return foundedUser;
    } catch (error) {
      this.logger.error('Error while finding user by username', error);
      throw new NotFoundException("User doesn't exist with this username");
    }
  }

  async findByEmail(email: string) {
    return this.prismaService.user
      .findUnique({
        where: { email },
      })
      .then((foundedUser) => {
        if (!foundedUser) {
          return null;
        }
        return foundedUser;
      })
      .catch((err) => {
        this.logger.error('Error while finding user by email', err);
        throw new NotFoundException("User doesn't exist with this email");
      });
  }

  async findByPhone(phone: string) {
    return this.prismaService.user
      .findUnique({
        where: { phone },
      })
      .then((foundedUser) => {
        if (!foundedUser) {
          return null;
        }

        return foundedUser;
      })
      .catch((err) => {
        this.logger.error('Error while finding user by phone number!', err);
        throw new NotFoundException(
          'Error while finding user by phone number!'
        );
      });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
