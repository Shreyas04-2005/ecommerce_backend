import { Expose } from 'class-transformer';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../dto/createUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../../dto/login.dto';

@Controller('public')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.service.registerUser(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }
}
