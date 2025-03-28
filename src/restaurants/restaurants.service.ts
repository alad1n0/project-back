import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Restaurant } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.RestaurantCreateInput): Promise<Restaurant> {
    return this.prisma.restaurant.create({ data });
  }

  findAll(): Promise<Restaurant[]> {
    return this.prisma.restaurant.findMany();
  }

  findOne(id: string): Promise<Restaurant | null> {
    return this.prisma.restaurant.findUnique({
      where: { id },
    });
  }

  update(id: string, data: Prisma.RestaurantUpdateInput): Promise<Restaurant> {
    return this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  remove(id: string): Promise<Restaurant> {
    return this.prisma.restaurant.delete({
      where: { id },
    });
  }

  async findTopRestaurants(): Promise<Restaurant[]> {
    return this.prisma.restaurant.findMany({
      orderBy: { rating: 'desc' },
      take: 8,
    });
  }
  
  async searchRestaurants(filters: {
    name?: string;
    minDeliveryPrice?: number;
    maxDeliveryPrice?: number;
    minCookingTime?: number;
    maxCookingTime?: number;
    minRating?: number;
    maxRating?: number;
  }): Promise<Pick<Restaurant, 'name' | 'deliveryPrice' | 'cookingTime' | 'rating' | 'banner'>[]> {
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        name: filters.name ? { contains: filters.name } : undefined,
        deliveryPrice: (filters.minDeliveryPrice || filters.maxDeliveryPrice)
          ? {
              gte: filters.minDeliveryPrice,
              lte: filters.maxDeliveryPrice,
            }
          : undefined,
        cookingTime: (filters.minCookingTime || filters.maxCookingTime)
          ? {
              gte: filters.minCookingTime,
              lte: filters.maxCookingTime,
            }
          : undefined,
        rating: (filters.minRating || filters.maxRating)
          ? {
              gte: filters.minRating,
              lte: filters.maxRating,
            }
          : undefined,
      },
      select: {
        name: true,
        deliveryPrice: true,
        cookingTime: true,
        rating: true,
        banner: true,
      },
    });
    return restaurants;
  }

}
