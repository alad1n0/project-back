import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import {ResponseHelper} from "../helper/response.helper";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, ResponseHelper],
})
export class CategoriesModule {}
