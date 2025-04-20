import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseHelper } from "../helper/response.helper";
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [
    MulterModule.register({
      dest: './public',
    }),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, PrismaService, ResponseHelper],
})
export class RestaurantsModule {}
