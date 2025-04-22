import {Controller, Get, Param, Query, Req} from '@nestjs/common';
import {ProductService} from './product.service';
import {Request} from "express";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('get-product/:id')
    async findOne(@Req() req: Request, @Param('id') id: string) {
        return await this.productService.findProductById(req, id);
    }

    @Get('get-product-restaurants-category/:id')
    findProductRestaurantCategory(@Param('id') id: string) {
        return this.productService.findProductRestaurantCategory(id);
    }

    @Get('get-product-restaurants/:id')
    findProductByCategoryAndSubcategory(@Req() req: Request, @Param('id') id: string, @Query('categoryId') categoryId: string, @Query('subcategoryId') subcategoryId?: string) {
        return this.productService.findProductByCategoryAndSubcategory(req, id, categoryId, subcategoryId);
    }
}