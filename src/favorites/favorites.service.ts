import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {Favorite} from '@prisma/client';
import {ActionsFavoriteDto} from "./dto/actions-favorite.dto";
import {Request} from "express";
import {ResponseHelper} from "../helper/response.helper";

@Injectable()
export class FavoritesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly responseHelper: ResponseHelper
    ) {}

    async actionsFavorite(req: Request, actionsFavoriteDto: ActionsFavoriteDto): Promise<Favorite> {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        const existingFavorite = await this.prisma.favorite.findFirst({
            where: {
                userId: userData.sub,
                restaurantId: actionsFavoriteDto.restaurantId,
            },
        });

        if (existingFavorite) {
            const updatedRestaurant = await this.prisma.restaurant.findUnique({
                where: {
                    id: actionsFavoriteDto.restaurantId,
                },
                select: {
                    id: true,
                    name: true
                },
            });

            await this.prisma.favorite.delete({
                where: {
                    id: existingFavorite.id,
                },
            });

            const formattedRestaurant = {
                ...updatedRestaurant,
                isFavorite: false,
            };

            return this.responseHelper.success(formattedRestaurant, 'Restaurant removed from favorites');
        } else {
            await this.prisma.favorite.create({
                data: {
                    userId: userData.sub,
                    restaurantId: actionsFavoriteDto.restaurantId,
                },
            });

            const updatedRestaurant = await this.prisma.restaurant.findUnique({
                where: {
                    id: actionsFavoriteDto.restaurantId,
                },
                select: {
                    id: true,
                    name: true,
                },
            });

            const formattedRestaurant = {
                ...updatedRestaurant,
                isFavorite: true,
            };

            return this.responseHelper.success(formattedRestaurant, 'Restaurant added to favorites');
        }
    }

    async getAllFavorites(req: Request): Promise<Favorite[]> {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        const favorites = await this.prisma.favorite.findMany({
            where: {
                userId: userData.sub,
            },
            select: {
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        banner: true,
                        rating: true,
                        workingHours: true,
                        cookingTime: true,
                        deliveryPrice: true,
                        favorites: {
                            where: {userId: userData.sub},
                            select: {id: true},
                        },
                    },
                }
            },
        });

        const formattedRestaurants = favorites
            .filter(f => f.restaurant !== null)
            .map(f => {
                const r = f.restaurant;
                return {
                    id: r.id,
                    name: r.name,
                    banner: r.banner ? `${process.env.FILE_BASE_URL}/${r.banner}` : null,
                    rating: r.rating,
                    workingHours: r.workingHours,
                    cookingTime: r.cookingTime,
                    deliveryPrice: r.deliveryPrice,
                    isFavorite: r.favorites.length > 0,
                };
            });

        return this.responseHelper.success(formattedRestaurants);
    }
}
