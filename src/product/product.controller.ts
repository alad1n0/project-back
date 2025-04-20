import {Controller, Get, Param, Query} from '@nestjs/common';
import {ProductService} from './product.service';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get(':id')
    async findOne(@Param('id') id: string, @Query('restaurantId') restaurantId: string) {
        return await this.productService.findProductById(id, restaurantId);
    }

    @Get('get-product-restaurants-category/:id')
    findProductRestaurantCategory(@Param('id') id: string) {
        return this.productService.findProductRestaurantCategory(id);
    }

    @Get('get-product-restaurants/:id')
    findProductByCategoryAndSubcategory(@Param('id') id: string, @Query('categoryId') categoryId: string, @Query('subcategoryId') subcategoryId?: string) {
        return this.productService.findProductByCategoryAndSubcategory(id, categoryId, subcategoryId);
    }
}