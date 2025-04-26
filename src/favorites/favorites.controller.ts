import {Controller, Post, Body, Req, Get} from '@nestjs/common';
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

  @Get('get-all-favorites')
  findAll(@Req() req: Request) {
    return this.favoritesService.getAllFavorites(req);
  }
}
