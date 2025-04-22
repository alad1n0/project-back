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

        let existingFavorite: Favorite | null;
        const { restaurantId, productId, type } = actionsFavoriteDto;

        if (type === 'restaurant' && restaurantId) {
            existingFavorite = await this.prisma.favorite.findFirst({
                where: {
                    userId: userData.sub,
                    restaurantId,
                },
            });
        } else if (type === 'product' && productId) {
            existingFavorite = await this.prisma.favorite.findFirst({
                where: {
                    userId: userData.sub,
                    productId,
                },
            });
        }

        if (existingFavorite) {
            await this.prisma.favorite.delete({
                where: {
                    id: existingFavorite.id,
                },
            });

            if (type === 'product' && productId) {
                const product = await this.prisma.restaurantProduct.findUnique({
                    where: { id: productId },
                    select: {
                        id: true,
                        product: {
                            select: {
                                categoryId: true
                            },
                        },
                    },
                });

                return this.responseHelper.success(
                    { id: product.id, isFavorite: false, categoryId: product.product.categoryId },
                    'Product removed from favorites'
                );
            }

            return this.responseHelper.success(
                { id: restaurantId, isFavorite: false },
                'Restaurant removed from favorites'
            );
        } else {
            await this.prisma.favorite.create({
                data: {
                    userId: userData.sub,
                    restaurantId: type === 'restaurant' ? restaurantId : null,
                    productId: type === 'product' ? productId : null,
                    type,
                },
            });

            if (type === 'product' && productId) {
                const product = await this.prisma.restaurantProduct.findUnique({
                    where: { id: productId },
                    select: {
                        id: true,
                        product: {
                            select: {
                                categoryId: true
                            },
                        },
                    },
                });

                return this.responseHelper.success(
                    { id: product.id, isFavorite: true, categoryId: product.product.categoryId },
                    'Product added to favorites'
                );
            }

            return this.responseHelper.success(
                { id: restaurantId, isFavorite: true },
                'Restaurant added to favorites'
            );
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
                            where: { userId: userData.sub },
                            select: { id: true },
                        },
                    },
                },
                product: {
                    select: {
                        id: true,
                        price: true,
                        weight: true,
                        restaurantId: true,
                        product: {
                            select: {
                                name: true,
                                description: true,
                                image: true,
                            }
                        },
                        favorites: {
                            where: { userId: userData.sub },
                            select: { id: true },
                        },
                    },
                },
            },
        });

        const restaurants = [];
        const products = [];

        for (const fav of favorites) {
            if (fav.restaurant) {
                const r = fav.restaurant;
                restaurants.push({
                    id: r.id,
                    name: r.name,
                    banner: r.banner ? `${process.env.FILE_BASE_URL}/${r.banner}` : null,
                    rating: r.rating,
                    workingHours: r.workingHours,
                    cookingTime: r.cookingTime,
                    deliveryPrice: r.deliveryPrice,
                    type: 'restaurant',
                    isFavorite: r.favorites.length > 0,
                });
            }

            if (fav.product) {
                const p = fav.product;
                products.push({
                    id: p.id,
                    restaurantsId: p.restaurantId,
                    name: p.product.name,
                    price: p.price,
                    weight: p.weight,
                    description: p.product.description,
                    image: p.product.image ? `${process.env.FILE_BASE_URL}/${p.product.image}` : null,
                    isFavorite: p.favorites.length > 0,
                })
            }
        }

        return this.responseHelper.success({
            restaurants,
            products,
        });
    }
}
