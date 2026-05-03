import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AddToCartDto } from '../../dto/addToCart.dto';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add-cart')
  addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.service.addToCart(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-cart')
  getMyCart(@Req() req: any) {
    return this.service.getCart(req.user.userId);
  }
}
