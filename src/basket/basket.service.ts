import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {UpdateBasketDto} from './dto/update-basket.dto';
import {BasketFormatter} from "./helper/basket.formatter";
import {ResponseHelper} from "../helper/response.helper";
import {Request} from "express";

@Injectable()
export class BasketService {
    constructor(
        private prisma: PrismaService,
        private formatter: BasketFormatter,
        private responseHelper: ResponseHelper
    ) {}

    async upsertItem(req: Request, dto: UpdateBasketDto) {
        const userData = req['jwt_payload'];

        const { productId, quantity, restaurantId, sessionId } = dto;

        const basketWhere = userData?.sub
            ? { userId: userData.sub }
            : { sessionId };

        const existingItems = await this.prisma.basketItem.findMany({
            where: basketWhere,
            select: { restaurantId: true },
            distinct: ['restaurantId'],
        });

        const otherRestaurant = existingItems.find(item => item.restaurantId !== restaurantId);
        if (otherRestaurant) {
            throw new Error('В кошику вже є товари з іншого ресторану. Очистіть кошик перед додаванням нових.');
        }

        const existing = await this.prisma.basketItem.findFirst({
            where: {
                ...basketWhere,
                productId,
                restaurantId,
            },
        });

        if (quantity === 0) {
            if (existing) {
                const formatted = this.formatter.format(existing, true);
                await this.prisma.basketItem.delete({ where: { id: existing.id } });
                return formatted;
            }
            return null;
        }

        const basketData = {
            userId: userData?.sub ?? null,
            sessionId: userData?.sub ? null : sessionId,
            productId,
            restaurantId,
            quantity,
        };

        const item = existing
            ? await this.prisma.basketItem.update({
                where: { id: existing.id },
                data: { quantity },
            })
            : await this.prisma.basketItem.create({ data: basketData });

        return this.formatter.format(item);
    }

    async getBasketProduct(req: Request, sessionId?: string) {
        const userData = req['jwt_payload'];

        const where = userData?.sub
            ? { userId: userData.sub }
            : sessionId
                ? {
                    sessionId:
                        (sessionId as unknown as { sessionId: string }).sessionId || sessionId,
                }
                : {};

        const items = await this.prisma.basketItem.findMany({
            where,
            select: {
                productId: true,
                quantity: true,
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
                            },
                        },
                    },
                },
            },
        });

        const quantityMap = items.reduce((acc, item) => {
            acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
            return acc;
        }, {} as Record<string, number>);

        const formattedProducts = items.map(item => ({
            id: item.product.id,
            restaurantId: item.product.restaurantId,
            name: item.product.product.name,
            description: item.product.product.description,
            price: item.product.price,
            weight: item.product.weight,
            image: item.product.product.image
                ? `${process.env.FILE_BASE_URL}/${item.product.product.image}`
                : null,
            quantityInBasket: quantityMap[item.productId] ?? null,
        }));

        return this.responseHelper.success(formattedProducts, 'Basket items');
    }

    async getCountInBasket(req: Request, sessionId?: string) {
        const userData = req['jwt_payload'];

        const where = userData?.sub
            ? { userId: userData.sub }
            : sessionId
                ? { sessionId: (sessionId as unknown as SessionId).sessionId || sessionId }
                : {}

        const count = await this.prisma.basketItem.count({
            where,
        });

        return this.responseHelper.success({ count }, 'Count in basket');
    }
}
