import {Controller, Post, Delete, Param, Body, Req} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import {ActionsFavoriteDto} from "./dto/actions-favorite.dto";
import {Request} from "express";

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('actions-favorite')
  create(@Req() req: Request, @Body() actionsFavoriteDto: ActionsFavoriteDto) {
    return this.favoritesService.actionsFavorite(req, actionsFavoriteDto);
  }

  // @Get()
  // findAll() {
  //   return this.favoritesService.findAllFavorites();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.favoritesService.findFavoriteById(id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() data: Partial<Favorite>) {
  //   return this.favoritesService.updateFavorite(id, data);
  // }
}
