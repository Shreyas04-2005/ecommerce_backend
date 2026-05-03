import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from '../../dto/createOrder.dto';
import { changeOrderStatusDto } from '../../dto/changeOrderStatus.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  //create order
  async createOrder(userId: string, dto: CreateOrderDto) {
    //transaction for commit or rollback
    return this.prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItems: any[] = [];

      //extract product
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        //product not found
        if (!product) {
          throw new BadRequestException('Product not found');
        }

        //stock excedded
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product: ${product.name}`,
          );
        }

        //get total
        const itemTotal = Number(product.price) * item.quantity;
        total += itemTotal;

        //update stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });

        //create orderItem
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      //create order
      const order = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }

  //get orders
  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  //get All orders
  async getAllOrders() {
    return this.prisma.order.findMany({
      select: {
        id: true,
        userId: true,
        status: true,
        total: true,
      },
    });
  }

  //get My All orders
  async getMyAllOrders(id: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        status: true,
        total: true,
        items: true,
      },
    });
    return {
      totalOrders: orders.length,
      orders: orders,
    };
  }

  //get order status
  async getMyOrderStatus(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!order || order.userId !== userId) {
      throw new NotFoundException(`Your Order not found with id ${orderId}`);
    }
    return order;
  }

  async changeOrderStatus(dto: changeOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: dto.orderId,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order not found with id ${dto.orderId}`);
    }
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order status cannot be changed');
    }

    const validTransitions = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
    };

    if (
      validTransitions[order.status] &&
      !validTransitions[order.status].includes(dto.status)
    ) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${dto.status}`,
      );
    }
    return this.prisma.order.update({
      where: { id: dto.orderId },
      data: { status: dto.status },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });
  }
}
