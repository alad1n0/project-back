import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Categories } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  createCategory(
    data: { name: string; imageUrl?: string; description?: string },
  ): Promise<Categories> {
    return this.prisma.categories.create({ data });
  }

  findAllCategories(): Promise<Categories[]> {
    return this.prisma.categories.findMany();
  }

  findCategoryById(id: number): Promise<Categories | null> {
    return this.prisma.categories.findUnique({ where: { id } });
  }

  updateCategory(id: number, data: Partial<Categories>): Promise<Categories> {
    return this.prisma.categories.update({
      where: { id },
      data,
    });
  }

  removeCategory(id: number): Promise<Categories> {
    return this.prisma.categories.delete({ where: { id } });
  }
}
