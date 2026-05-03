import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto } from '../../dto/addToCart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    // 1. find product
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 2. get or create cart
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    // 3. check existing cart item
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
    });

    const newQuantity = (existingItem?.quantity || 0) + dto.quantity;

    // 4. validate stock properly
    if (product.stock < newQuantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}, requested: ${newQuantity}`,
      );
    }

    // 5. upsert cart item
    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
      create: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      },
      update: {
        quantity: {
          increment: dto.quantity,
        },
      },
      include: {
        product: true,
      },
    });
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description:true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    return {
      ...cart,
      total,
    };
  }
}
