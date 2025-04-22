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

        const { productCategoryId, productId, quantity, restaurantId } = dto;

        const existingItems = await this.prisma.basketItem.findMany({
            where: { userId: userData.sub },
            select: { restaurantId: true },
            distinct: ['restaurantId'],
        });

        const otherRestaurant = existingItems.find(item => item.restaurantId !== restaurantId);
        if (otherRestaurant) {
            throw new Error('В кошику вже є товари з іншого ресторану. Очистіть кошик перед додаванням нових.');
        }

        const existing = await this.prisma.basketItem.findFirst({
            where: {
                userId: userData.sub,
                productId,
                productCategoryId,
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

        let item: { id: string; userId: string; productCategoryId: string; productId: string; restaurantId: string; quantity: number; createdAt: Date; updatedAt: Date; };

        if (existing) {
            item = await this.prisma.basketItem.update({
                where: { id: existing.id },
                data: { quantity },
            });
        } else {
            item = await this.prisma.basketItem.create({
                data: {
                    userId: userData.sub,
                    productCategoryId,
                    productId,
                    restaurantId,
                    quantity,
                },
            });
        }

        return this.formatter.format(item);
    }

    // async getAll(userId: string) {
    //     const items = await this.prisma.basketItem.findMany({
    //         where: {userId},
    //         include: {
    //             product: true,
    //             productCategory: true,
    //         },
    //     });
    //     return items.map(i => ({
    //         ...this.formatter.format(i),
    //         product: i.product,
    //         category: i.productCategory,
    //     }));
    // }

    async getCountInBasket(req: Request) {
        const userData = req['jwt_payload'];
        const count = await this.prisma.basketItem.count({ where: { userId: userData.sub } });
        return this.responseHelper.success({count}, 'Count in basket');
    }
}
