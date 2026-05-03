import { OrderStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class changeOrderStatusDto {
  @IsUUID()
  orderId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
