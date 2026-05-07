import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AddToCartDto } from '../../dto/addToCart.dto';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { Throttle } from '@nestjs/throttler';

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Post('add-cart')
  addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.service.addToCart(req.user.userId, dto);
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Get('get-cart')
  getMyCart(@Req() req: any) {
    return this.service.getCart(req.user.userId);
  }
}
