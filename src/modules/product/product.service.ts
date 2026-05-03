import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddProductDto } from '../../dto/addProduct.dto';
import { retry } from 'rxjs';
import { AddStockDto } from '../../dto/addStock.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async addProduct(dto: AddProductDto) {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        name: dto.name,
      },
    });
    if (existingProduct) {
      throw new BadRequestException('product already present');
    }
    return this.prisma.product.create({
      data: {
        name: dto.name,
        category: dto.categary,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
      },
    });
  }

  async deleteProduct(id: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    return this.prisma.product.delete({
      where: {
        id: id,
      },
    });
  }

  async getProduct(id: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        price: true,
        stock: true,
        orderItems: true,
      },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    return existingProduct;
  }

  async getAllProduct() {
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        price: true,
        stock: true,
      },
    });
    return {
      totalProducts: products.length,
      products: products,
    };
  }

  async addStock(dto:AddStockDto) {
 
  const product = await this.prisma.product.update({
    where: { id: dto.productId },
    data: {
      stock: {
        increment: dto.quantity, 
      },
    },
    select: {
      id: true,
      name: true,
      stock: true,
    },
  });

  return product;
}
}
