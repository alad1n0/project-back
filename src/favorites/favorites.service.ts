import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  createFavorite(userId: string, restaurantId: string): Promise<Favorite> {
    return this.prisma.favorite.create({
      data: { userId, restaurantId },
    });
  }

  findAllFavorites(): Promise<Favorite[]> {
    return this.prisma.favorite.findMany();
  }

  findFavoriteById(id: string): Promise<Favorite | null> {
    return this.prisma.favorite.findUnique({
      where: { id },
    });
  }

  updateFavorite(id: string, data: Partial<Favorite>): Promise<Favorite> {
    return this.prisma.favorite.update({
      where: { id },
      data,
    });
  }

  removeFavorite(id: string): Promise<Favorite> {
    return this.prisma.favorite.delete({
      where: { id },
    });
  }
}
