import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../prisma/prisma.service';
import {ResponseHelper} from "../helper/response.helper";

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService, ResponseHelper],
})
export class FavoritesModule {}
