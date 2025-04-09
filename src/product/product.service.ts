import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  createProduct(data: { name: string; description?: string; group?: string; isAllergen?: boolean }): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  findAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  findProductById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  removeProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
