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
            await this.prisma.favorite.delete({
                where: {
                    id: existingFavorite.id,
                },
            });

            const updatedRestaurant = await this.prisma.restaurant.findUnique({
                where: {
                    id: actionsFavoriteDto.restaurantId,
                },
                select: {
                    id: true,
                    name: true,
                    favorites: {
                        where: {userId: userData.sub},
                        select: {id: true},
                    },
                },
            });

            const formattedRestaurant = {
                ...updatedRestaurant,
                isFavorite: updatedRestaurant ? updatedRestaurant.favorites.length > 0 : false,
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
                    favorites: {
                        where: {userId: userData.sub},
                        select: {id: true},
                    },
                },
            });

            const formattedRestaurant = {
                ...updatedRestaurant,
                isFavorite: updatedRestaurant ? updatedRestaurant.favorites.length > 0 : false,
            };

            return this.responseHelper.success(formattedRestaurant, 'Restaurant added to favorites');
        }
    }

    // findAllFavorites(): Promise<Favorite[]> {
    //   return this.prisma.favorite.findMany();
    // }

    // findFavoriteById(id: string): Promise<Favorite | null> {
    //   return this.prisma.favorite.findUnique({
    //     where: { id },
    //   });
    // }

    // updateFavorite(id: string, data: Partial<Favorite>): Promise<Favorite> {
    //   return this.prisma.favorite.update({
    //     where: { id },
    //     data,
    //   });
    // }
}
