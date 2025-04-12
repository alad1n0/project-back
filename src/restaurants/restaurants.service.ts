import {Injectable} from '@nestjs/common';
import {Restaurant} from '@prisma/client';
import {PrismaService} from '../prisma/prisma.service';
import {ResponseHelper} from "../helper/response.helper";
import {GetRestaurantDto} from "./dto/get-restaurant.dto";

@Injectable()
export class RestaurantsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly responseHelper: ResponseHelper
    ) {}

    async findAll(req: Request, paginationDto: GetRestaurantDto): Promise<Partial<Restaurant>[]> {
        const userData = req['jwt_payload'];

        const {page = 1, limit = 20, categoryId, sortByPopularity, isFreeDelivery} = paginationDto;
        const skip = (page - 1) * limit;

        console.log(sortByPopularity);

        console.log(sortByPopularity ? 'sortByPopularity' : 'not sortByPopularity');

        console.log(isFreeDelivery ? 'isFreeDelivery' : 'not isFreeDelivery');

        const where: any = {};

        if (categoryId) {
            where.categoryRestaurants = {
                some: {
                    categoryId,
                },
            };
        }

        if (isFreeDelivery) {
            where.deliveryPrice = 0;
        }

        const totalItems = await this.prisma.restaurant.count();

        const restaurants = await this.prisma.restaurant.findMany({
            where,
            skip,
            take: limit,
            orderBy: sortByPopularity ? { rating: 'desc' } : undefined,
            select: {
                id: true,
                name: true,
                banner: true,
                rating: true,
                workingHours: true,
                cookingTime: true,
                deliveryPrice: true,
                favorites: userData ? {
                    where: {userId: userData.sub},
                    select: {id: true},
                } : false,
            }
        });

        const formattedRestaurants = restaurants.map(restaurant => ({
            ...restaurant,
            banner: restaurant.banner ? `${process.env.FILE_BASE_URL}/${restaurant.banner}` : null,
            isFavorite: userData ? restaurant.favorites.length > 0 : false,
        }));

        const totalPages = Math.ceil(totalItems / limit);

        const meta = {
            totalItems,
            totalPages,
            currentPage: page,
            limit
        };

        return this.responseHelper.success({restaurants: formattedRestaurants, meta});
    }

    async findTopRestaurants(req: Request): Promise<Partial<Restaurant>[]> {
        const userData = req['jwt_payload'];

        const restaurants = await this.prisma.restaurant.findMany({
            orderBy: {rating: 'desc'},
            take: 8,
            select: {
                id: true,
                name: true,
                banner: true,
                rating: true,
                workingHours: true,
                cookingTime: true,
                deliveryPrice: true,
                favorites: userData ? {
                    where: {userId: userData.sub},
                    select: {id: true},
                } : false,
            }
        });

        const formattedRestaurants = restaurants.map(restaurant => ({
            ...restaurant,
            banner: restaurant.banner ? `${process.env.FILE_BASE_URL}/${restaurant.banner}` : null,
            isFavorite: userData ? restaurant.favorites.length > 0 : false,
        }));

        return this.responseHelper.success(formattedRestaurants);
    }

    async findOneRestaurant(id: string): Promise<Restaurant> {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                address: true,
                numberOfWorkers: true,
                description: true,
                banner: true,
                rating: true,
                logo: true,
                workingHours: true,
                cookingTime: true,
                deliveryPrice: true,
                minimumOrderPrice: true,
            }
        });

        const formattedRestaurant = {
            ...restaurant,
            banner: restaurant.banner ? `${process.env.FILE_BASE_URL}/${restaurant.banner}` : null,
            logo: restaurant.logo ? `${process.env.FILE_BASE_URL}/${restaurant.logo}` : null,
        };

        return this.responseHelper.success(formattedRestaurant);
    }

    // create(data: Prisma.RestaurantCreateInput): Promise<Restaurant> {
    //   return this.prisma.restaurant.create({ data });
    // }

    // update(id: string, data: Prisma.RestaurantUpdateInput): Promise<Restaurant> {
    //   return this.prisma.restaurant.update({
    //     where: { id },
    //     data,
    //   });
    // }

    // remove(id: string): Promise<Restaurant> {
    //   return this.prisma.restaurant.delete({
    //     where: { id },
    //   });
    // }

    // async searchRestaurants(filters: {
    //   name?: string;
    //   minDeliveryPrice?: number;
    //   maxDeliveryPrice?: number;
    //   minCookingTime?: number;
    //   maxCookingTime?: number;
    //   minRating?: number;
    //   maxRating?: number;
    // }): Promise<Pick<Restaurant, 'name' | 'deliveryPrice' | 'cookingTime' | 'rating' | 'banner'>[]> {
    //   const restaurants = await this.prisma.restaurant.findMany({
    //     where: {
    //       name: filters.name ? { contains: filters.name } : undefined,
    //       deliveryPrice: (filters.minDeliveryPrice || filters.maxDeliveryPrice)
    //         ? {
    //             gte: filters.minDeliveryPrice,
    //             lte: filters.maxDeliveryPrice,
    //           }
    //         : undefined,
    //       cookingTime: (filters.minCookingTime || filters.maxCookingTime)
    //         ? {
    //             gte: filters.minCookingTime,
    //             lte: filters.maxCookingTime,
    //           }
    //         : undefined,
    //       rating: (filters.minRating || filters.maxRating)
    //         ? {
    //             gte: filters.minRating,
    //             lte: filters.maxRating,
    //           }
    //         : undefined,
    //     },
    //     select: {
    //       name: true,
    //       deliveryPrice: true,
    //       cookingTime: true,
    //       rating: true,
    //       banner: true,
    //     },
    //   });
    //   return restaurants;
    // }
}