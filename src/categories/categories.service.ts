import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {Categories} from '@prisma/client';
import {ResponseHelper} from "../helper/response.helper";

@Injectable()
export class CategoriesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly responseHelper: ResponseHelper
    ) {}

    async findAllCategories(): Promise<Categories[]> {
        const categories = await this.prisma.categories.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                },
            },
        );

        const formattedCategories = categories.map(category => ({
            ...category,
            imageUrl: category.imageUrl ? `${process.env.FILE_BASE_URL}/${category.imageUrl}` : null,
        }));

        return this.responseHelper.success(formattedCategories, 'Categories fetched successfully');
    }

    async filndTopCategories(): Promise<Categories[]> {
        const categories = await this.prisma.categories.findMany({
            take: 9,
            select: {
                id: true,
                name: true,
                imageUrl: true,
            }
        });

        const formattedCategories = categories.map(category => ({
            ...category,
            imageUrl: category.imageUrl ? `${process.env.FILE_BASE_URL}/${category.imageUrl}` : null,
        }));

        return this.responseHelper.success(formattedCategories, 'Categories fetched successfully');
    }

    // createCategory(
    //   data: { name: string; imageUrl?: string; description?: string },
    // ): Promise<Categories> {
    //   return this.prisma.categories.create({ data });
    // }

    // findCategoryById(id: number): Promise<Categories | null> {
    //   return this.prisma.categories.findUnique({ where: { id } });
    // }
    //
    // updateCategory(id: number, data: Partial<Categories>): Promise<Categories> {
    //   return this.prisma.categories.update({
    //     where: { id },
    //     data,
    //   });
    // }
    //
    // removeCategory(id: number): Promise<Categories> {
    //   return this.prisma.categories.delete({ where: { id } });
    // }
}
