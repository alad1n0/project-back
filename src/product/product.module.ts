import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import {ResponseHelper} from "../helper/response.helper";

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, ResponseHelper],
})
export class ProductModule {}
