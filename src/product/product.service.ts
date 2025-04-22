import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {ResponseHelper} from "../helper/response.helper";
import {Product, Restaurant} from "@prisma/client";
import {Request} from "express";

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly responseHelper: ResponseHelper
    ) {}

    async findProductRestaurantCategoriesWithProducts(restaurantId: string) {
        const categories = await this.prisma.restaurantProductCategory.findMany({
            where: { restaurantId },
            include: {
                category: {
                    include: {
                        products: {
                            where: {
                                restaurantProducts: {
                                    some: {
                                        restaurantId,
                                    },
                                },
                            },
                            include: {
                                sizes: true,
                                subcategory: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedCategories = categories.map(({ category }) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            products: category.products.map(product => ({
                ...product,
                image: product.image ? `${process.env.FILE_BASE_URL}/${product.image}` : null,
            })),
        }));

        const promotions = await this.prisma.promotion.findMany({
            where: {
                restaurantId,
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            },
            include: {
                promotionProducts: {
                    include: {
                        product: {
                            include: {
                                sizes: true,
                                category: true,
                                subcategory: true,
                            },
                        },
                    },
                },
            },
        });

        if (promotions.length) {
            const promoCategory = {
                id: "PROMO",
                name: "Акції",
                description: "Товари, що беруть участь в акціях",
                products: [],
                promotions: promotions.map(promo => ({
                    id: promo.id,
                    name: promo.name,
                    description: promo.description,
                    banner: promo.banner ? `${process.env.FILE_BASE_URL}/${promo.banner}` : null,
                    discount: promo.discount,
                    products: promo.promotionProducts.map(pp => ({
                        ...pp.product,
                        image: pp.product.image
                            ? `${process.env.FILE_BASE_URL}/${pp.product.image}`
                            : null,
                    })),
                })),
            };

            formattedCategories.unshift(promoCategory);
        }

        return this.responseHelper.success(formattedCategories, 'Категорії з продуктами завантажено');
    }

    async getCategoryProductsOrAll({restaurantId, categoryId, page = 1, limit = 10}: { restaurantId: string; categoryId?: string; page?: number; limit?: number; }) {
        const skip = (page - 1) * limit;

        if (categoryId) {
            if (categoryId === 'PROMO') {
                const promotions = await this.prisma.promotion.findMany({
                    where: {
                        restaurantId,
                        startDate: { lte: new Date() },
                        endDate: { gte: new Date() },
                    },
                    include: {
                        promotionProducts: {
                            include: {
                                product: {
                                    include: {
                                        sizes: true,
                                        category: true,
                                        subcategory: true,
                                    },
                                },
                            },
                        },
                    },
                });

                const products = promotions.flatMap(promo =>
                    promo.promotionProducts.map(pp => ({
                        ...pp.product,
                        categoryId: pp.product.category?.id ?? null,
                        image: pp.product.image
                            ? `${process.env.FILE_BASE_URL}/${pp.product.image}`
                            : null,
                        promotionId: promo.id,
                        promotionDiscount: promo.discount,
                    }))
                );

                const paginated = products.slice(skip, skip + limit);

                return this.responseHelper.success({
                    category: {
                        id: 'PROMO',
                        name: 'Акції',
                        description: 'Товари, що беруть участь в акціях',
                    },
                    products: paginated,
                    total: products.length,
                    totalPages: Math.ceil(products.length / limit),
                    page,
                });
            }

            const [products, total] = await Promise.all([
                this.prisma.product.findMany({
                    where: {
                        categoryId,
                        restaurantProducts: {
                            some: { restaurantId },
                        },
                    },
                    include: {
                        sizes: true,
                        subcategory: true,
                    },
                    skip,
                    take: limit,
                }),
                this.prisma.product.count({
                    where: {
                        categoryId,
                        restaurantProducts: {
                            some: { restaurantId },
                        },
                    },
                }),
            ]);

            const formatted = products.map(product => ({
                ...product,
                categoryId,
                image: product.image ? `${process.env.FILE_BASE_URL}/${product.image}` : null,
            }));

            const category = await this.prisma.restaurantProductCategory.findUnique({
                where: { id: categoryId },
            });

            return this.responseHelper.success({
                category,
                products: formatted,
                total,
                totalPages: Math.ceil(total / limit),
                page,
            });
        }

        const categories = await this.prisma.restaurantProductCategory.findMany({
            where: { restaurantId },
            include: { category: true },
        });

        const formattedCategories = categories.map(({ category }) => ({
            id: category.id,
            name: category.name,
            description: category.description,
        }));

        const hasPromotions = await this.prisma.promotion.count({
            where: {
                restaurantId,
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            },
        });

        if (hasPromotions > 0) {
            formattedCategories.unshift({
                id: 'PROMO',
                name: 'Акції',
                description: 'Товари, що беруть участь в акціях',
            });
        }

        return this.responseHelper.success(formattedCategories, 'Список категорій');
    }

    async findProductById(req: Request, id: string): Promise<Partial<Product>> {
        const userData = req['jwt_payload'];

        const product = await this.prisma.restaurantProduct.findUnique({
            where: { id },
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
                favorites: userData ? {
                    where: {userId: userData.sub},
                    select: {id: true},
                } : false,
            },
        });

        if (!product) {
            throw new NotFoundException(`Продукт з id: ${id} не знайдено`);
        }

        const response = {
            id: product.id,
            restaurantId: product.restaurantId,
            name: product.product.name,
            description: product.product.description,
            image: product.product.image
                ? `${process.env.FILE_BASE_URL?.replace(/\/$/, '')}/${product.product.image}`
                : null,
            price: product.price,
            weight: product.weight,
            isFavorite: userData ? product.favorites.length > 0 : false,
        };

        return this.responseHelper.success(response, 'Продукт успішно отримано');
    }

    async findProductRestaurantCategory(restaurantId: string): Promise<Partial<Restaurant>[]> {
        const categoriesWithSubcategories = await this.prisma.restaurantProductCategory.findMany({
            where: {
                restaurantId,
            },
            select: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        subcategories: {
                            where: {
                                product: {
                                    some: {
                                        restaurantProducts: {
                                            some: {
                                                restaurantId,
                                            },
                                        },
                                    },
                                },
                            },
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedCategories = categoriesWithSubcategories.map(item => {
            const { id, name, subcategories } = item.category;
            return {
                id,
                name,
                subcategories: subcategories || [],
            };
        });

        const hasPromotions = await this.prisma.promotion.findFirst({
            where: {
                restaurantId,
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            },
            select: { id: true },
        });

        if (hasPromotions) {
            formattedCategories.push({
                id: 'PROMOTION',
                name: 'Акції',
                subcategories: [],
            });
        }

        return this.responseHelper.success(formattedCategories, 'Categories with subcategories fetched successfully');
    }

    async findProductByCategoryAndSubcategory(req: Request, restaurantId: string, categoryId: string, subcategoryId?: string): Promise<Partial<Product>[]> {
        const userData = req['jwt_payload'];

        const products = await this.prisma.restaurantProduct.findMany({
            where: {
                product: {
                    categoryId,
                    ...(subcategoryId && {
                        subcategoryId,
                    }),
                },
                restaurantId,
            },
            select: {
                id: true,
                price: true,
                weight: true,
                favorites: userData ? {
                    where: {userId: userData.sub},
                    select: {id: true},
                } : false,
                product: {
                    select: {
                        name: true,
                        description: true,
                        image: true,
                    }
                },
            },
        });

        const formattedProducts = products.map(product => ({
            id: product.id,
            restaurantId,
            name: product.product.name,
            description: product.product.description,
            price: product.price,
            weight: product.weight,
            image: product.product.image ? `${process.env.FILE_BASE_URL}/${product.product.image}` : null,
            isFavorite: userData ? product.favorites.length > 0 : false,
        }));

        return this.responseHelper.success(formattedProducts, 'Products fetched successfully');
    }
}
