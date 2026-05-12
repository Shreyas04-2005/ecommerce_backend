import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { RolesGuard } from '../../guards/roles-guard';
import { Roles } from '../../guards/role-decorator';
import { Throttle } from '@nestjs/throttler';
import { CreateUserDto } from '../../dto/createUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('add-admin')
  addAdmin(@Body() dto: CreateUserDto) {
    return this.service.createAdmin(dto);
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('all-users')
  getAllUsers() {
    return this.service.getAllUsers();
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('get-user/:id')
  getUser(@Param('id') id: string) {
    return this.service.getUserById(id);
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('delete-user/:id')
  deleteUser(@Param('id') id: string) {
    return this.service.deleteUserById(id);
  }
}
