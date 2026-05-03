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

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("ADMIN")
  @Get("all-users")
  getAllUsers() {
    return this.service.getAllUsers();
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("ADMIN")
  @Get("get-user/:id")
  getUser(@Param("id")id:string) {
    return this.service.getUserById(id);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("ADMIN")
  @Get("delete-user/:id")
  deleteUser(@Param("id")id:string) {
    return this.service.deleteUserById(id);
  }

}
