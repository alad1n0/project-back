import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { BasketFormatter } from './basket.formatter';

@Injectable()
export class BasketService {
  constructor(
    private prisma: PrismaService,
    private formatter: BasketFormatter,
  ) {}

  async upsertItem(userId: string, dto: UpdateBasketDto) {
    const { productCategoryId, productId, quantity } = dto;
    const compoundKey = {
      userId,
      productCategoryId,
      productId,
    };

    const existing = await this.prisma.basketItem.findUnique({
      where: { userId_productCategoryId_productId: compoundKey },
    });

    if (quantity === 0) {
      if (existing) {
        const formatted = this.formatter.format(existing, true);
        await this.prisma.basketItem.delete({ where: { id: existing.id } });
        return formatted;
      }
      return null;
    }

    const item = await this.prisma.basketItem.upsert({
      where: { userId_productCategoryId_productId: compoundKey },
      update: { quantity },
      create: { ...compoundKey, quantity },
    });

    return this.formatter.format(item);
  }

  async getAll(userId: string) {
    const items = await this.prisma.basketItem.findMany({
      where: { userId },
      include: {
        product: true,
        productCategory: true,
      },
    });
    return items.map(i => ({
      ...this.formatter.format(i),
      product: i.product,
      category: i.productCategory,
    }));
  }

  async clear(userId: string) {
    await this.prisma.basketItem.deleteMany({ where: { userId } });
    return { message: 'Basket cleared' };
  }

  async removeMany(userId: string, ids: string[]) {
    await this.prisma.basketItem.deleteMany({
      where: { userId, id: { in: ids } },
    });
    return { message: 'Items removed' };
  }
}
