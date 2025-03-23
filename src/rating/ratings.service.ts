import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RestaurantRating } from '@prisma/client';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  createRating(
    userId: string,
    restaurantId: string,
    rating: number,
  ): Promise<RestaurantRating> {
    return this.prisma.restaurantRating.create({
      data: { userId, restaurantId, rating },
    });
  }

  findAllRatings(): Promise<RestaurantRating[]> {
    return this.prisma.restaurantRating.findMany();
  }

  findRatingById(id: string): Promise<RestaurantRating | null> {
    return this.prisma.restaurantRating.findUnique({
      where: { id },
    });
  }

  updateRating(id: string, data: Partial<RestaurantRating>): Promise<RestaurantRating> {
    return this.prisma.restaurantRating.update({
      where: { id },
      data,
    });
  }

  removeRating(id: string): Promise<RestaurantRating> {
    return this.prisma.restaurantRating.delete({
      where: { id },
    });
  }
}
