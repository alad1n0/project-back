import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}


  @Get('get-all')
  async findAll() {
    const products = await this.productService.findAllProducts();
    return products;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findProductById(id);
    return product;
  }
}


