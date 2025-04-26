import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {ResponseHelper} from "../helper/response.helper";
import {BasketController} from "./basket.controller";
import {BasketService} from "./basket.service";
import {BasketFormatter} from "./helper/basket.formatter";

@Module({
    controllers: [BasketController],
    providers: [BasketService, PrismaService, ResponseHelper, BasketFormatter],
})
export class BasketModule {}