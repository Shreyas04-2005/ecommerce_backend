import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../../dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(dto: CreateUserDto) {
    //Check if user exists
    const exisingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (exisingUser) {
      throw new BadRequestException('email already exist');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    //Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    //Remove password from response
    const { password, ...result } = user;

    return result;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    return {
      totalUsers: users.length,
      users: users,
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        orders: true,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found with id ', id);
    }
    return user;
  }

  async deleteUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        orders: true,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found with id ', id);
    }
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
