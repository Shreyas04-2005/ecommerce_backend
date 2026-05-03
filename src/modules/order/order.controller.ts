import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { CreateOrderDto } from '../../dto/createOrder.dto';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { RolesGuard } from '../../guards/roles-guard';
import { Roles } from '../../guards/role-decorator';
import { changeOrderStatusDto } from '../../dto/changeOrderStatus.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('place-order')
  createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-all-orders')
  MyAllOrders(@Req() req: any) {
    return this.orderService.getMyAllOrders(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('all-orders')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('order-status/:orderId')
  getMyOrderStatus(@Req() req: any, @Param('orderId') id: string) {
    return this.orderService.getMyOrderStatus(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('change-status')
  changeOrderStatus(@Body() dto: changeOrderStatusDto) {
    return this.orderService.changeOrderStatus(dto);
  }
}
