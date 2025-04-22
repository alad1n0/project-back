import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {ResponseHelper} from "../helper/response.helper";
import {BasketController} from "./basket.controller";
import {BasketService} from "./basket.service";

@Module({
    controllers: [BasketController],
    providers: [BasketService, PrismaService, ResponseHelper],
})
export class BasketModule {}