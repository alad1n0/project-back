import {Controller, Body, Req, Get, Post, Query} from '@nestjs/common';
import {BasketService} from './basket.service';
import {UpdateBasketDto} from './dto/update-basket.dto';
import {Request} from "express";

@Controller('basket')
export class BasketController {
    constructor(private readonly basketService: BasketService) {}

    @Post('actions-basket')
    upsert(@Req() req: Request, @Body() dto: UpdateBasketDto,) {
        return this.basketService.upsertItem(req, dto);
    }

    @Get('product-basket')
    getBasketProduct(@Req() req: Request, @Query() sessionId: string) {
      return this.basketService.getBasketProduct(req, sessionId);
    }

    @Get("count")
    getCountInBasket(@Req() req: Request, @Query() sessionId: string) {
        return this.basketService.getCountInBasket(req, sessionId);
    }
}
