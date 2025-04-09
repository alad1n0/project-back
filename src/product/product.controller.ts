import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() body: { name: string; description?: string; group?: string; isAllergen?: boolean }): Promise<Product> {
    return this.productService.createProduct(body);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAllProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productService.findProductById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Product>): Promise<Product> {
    return this.productService.updateProduct(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Product> {
    return this.productService.removeProduct(+id);
  }
}
