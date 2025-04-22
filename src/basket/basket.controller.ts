import {Controller, Patch, Body, Req, Get} from '@nestjs/common';
import {BasketService} from './basket.service';
import {UpdateBasketDto} from './dto/update-basket.dto';
import {Request} from "express";

@Controller('basket')
export class BasketController {
    constructor(private readonly basketService: BasketService) {}

    @Patch()
    upsert(@Req() req: Request, @Body() dto: UpdateBasketDto,) {
        return this.basketService.upsertItem(req, dto);
    }

    // @Get()
    // getAll(@Req() req: Request) {
    //   return this.basketService.getAll(req);
    // }

    @Get("count")
    getCountInBasket(@Req() req: Request) {
        return this.basketService.getCountInBasket(req);
    }
}
