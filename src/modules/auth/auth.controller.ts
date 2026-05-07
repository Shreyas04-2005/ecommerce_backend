import { Expose } from 'class-transformer';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../dto/createUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../../dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('public')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(@Body() dto: CreateUserDto) {
    return this.service.registerUser(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }
}
