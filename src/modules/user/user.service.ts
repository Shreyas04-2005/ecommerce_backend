import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
