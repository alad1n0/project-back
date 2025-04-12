import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categories } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('get-all')
  findAll() {
    return this.categoriesService.findAllCategories();
  }

  @Get('get-top')
  findTop() {
    return this.categoriesService.filndTopCategories();
  }

  // @Post()
  // create(@Body() body: { name: string; imageUrl?: string; description?: string }): Promise<Categories> {
  //   return this.categoriesService.createCategory(body);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<Categories | null> {
  //   return this.categoriesService.findCategoryById(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() data: Partial<Categories>): Promise<Categories> {
  //   return this.categoriesService.updateCategory(+id, data);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string): Promise<Categories> {
  //   return this.categoriesService.removeCategory(+id);
  // }
}
