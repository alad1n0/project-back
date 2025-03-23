import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favorite } from '@prisma/client';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() body: { userId: string; restaurantId: string }) {
    return this.favoritesService.createFavorite(body.userId, body.restaurantId);
  }

  @Get()
  findAll() {
    return this.favoritesService.findAllFavorites();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritesService.findFavoriteById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Favorite>) {
    return this.favoritesService.updateFavorite(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.removeFavorite(id);
  }
}
