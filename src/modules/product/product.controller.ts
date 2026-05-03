import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../dto/createUser.dto';
import { ProductService } from './product.service';
import { AddProductDto } from '../../dto/addProduct.dto';
import { retry } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { RolesGuard } from '../../guards/roles-guard';
import { Roles } from '../../guards/role-decorator';
import { AddStockDto } from '../../dto/addStock.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('add-product')
  async addProduct(@Body() dto: AddProductDto) {
    return this.service.addProduct(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('delete-product/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.service.deleteProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-product/:id')
  async getProduct(@Param('id') id: string) {
    return this.service.getProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-products')
  async getAllProduct() {
    return this.service.getAllProduct();
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("ADMIN")
  @Patch('add-stock')
  addStock(@Body()dto:AddStockDto ) {
    return this.service.addStock(dto);
  }
}
