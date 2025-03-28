import { Controller, Get, Post, Body, Param, Patch, Delete, Query  } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Prisma } from '@prisma/client';


@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  create(@Body() createRestaurantDto: Prisma.RestaurantCreateInput) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: Prisma.RestaurantUpdateInput,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }

  @Get('top')
getTopRestaurants() {
  return this.restaurantsService.findTopRestaurants();
}

@Get('search')
  search(@Query() query: any) {
    const filters = {
      name: query.name,
      minDeliveryPrice: query.minDeliveryPrice ? Number(query.minDeliveryPrice) : undefined,
      maxDeliveryPrice: query.maxDeliveryPrice ? Number(query.maxDeliveryPrice) : undefined,
      minCookingTime: query.minCookingTime ? Number(query.minCookingTime) : undefined,
      maxCookingTime: query.maxCookingTime ? Number(query.maxCookingTime) : undefined,
      minRating: query.minRating ? Number(query.minRating) : undefined,
      maxRating: query.maxRating ? Number(query.maxRating) : undefined,
    };
    return this.restaurantsService.searchRestaurants(filters);
  }

}
