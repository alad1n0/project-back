import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, PrismaService],
})
export class RestaurantsModule {}
