import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}


  async findAllProducts() {

    const products = await this.prisma.product.findMany({
      include: {
        sizes: true,
        options: true,
        category: true,
        subcategory: true 
      },
    });

    const formattedProducts = products.map(product => ({
      ...product,
      image: product.image ? `${process.env.FILE_BASE_URL}/${product.image}` : null,
    }));

    return formattedProducts;
  }

  async findProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        sizes: true,
        options: true,
        category: true,
        subcategory: true
      },
    });

    if (!product) {
      throw new NotFoundException(`Продукт з id: ${id} не знайдено`);
    }

    return {
      ...product,
      image: product.image ? `${process.env.FILE_BASE_URL}/${product.image}` : null,
    };
  }
}
