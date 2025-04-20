import {Controller, Get, Param, Query, Req} from '@nestjs/common';
import {RestaurantsService} from './restaurants.service';
import {GetRestaurantDto} from "./dto/get-restaurant.dto";

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) {}

    @Get('get-restaurants')
    findAll(@Req() req: Request, @Query() paginationDto: GetRestaurantDto) {
        return this.restaurantsService.findAll(req, paginationDto);
    }

    @Get('get-top-restaurants')
    getTopRestaurants(@Req() req: Request) {
        return this.restaurantsService.findTopRestaurants(req);
    }

    @Get('get-restaurant/:id')
    findOne(@Param('id') id: string) {
        return this.restaurantsService.findOneRestaurant(id);
    }

    // @Post()
    // create(@Body() createRestaurantDto: Prisma.RestaurantCreateInput) {
    //   return this.restaurantsService.create(createRestaurantDto);
    // }

    // @Patch(':id')
    // update(
    //   @Param('id') id: string,
    //   @Body() updateRestaurantDto: Prisma.RestaurantUpdateInput,
    // ) {
    //   return this.restaurantsService.update(id, updateRestaurantDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.restaurantsService.remove(id);
    // }

    // @Get('search')
    // search(@Query() query: any) {
    //   const filters = {
    //     name: query.name,
    //     minDeliveryPrice: query.minDeliveryPrice ? Number(query.minDeliveryPrice) : undefined,
    //     maxDeliveryPrice: query.maxDeliveryPrice ? Number(query.maxDeliveryPrice) : undefined,
    //     minCookingTime: query.minCookingTime ? Number(query.minCookingTime) : undefined,
    //     maxCookingTime: query.maxCookingTime ? Number(query.maxCookingTime) : undefined,
    //     minRating: query.minRating ? Number(query.minRating) : undefined,
    //     maxRating: query.maxRating ? Number(query.maxRating) : undefined,
    //   };
    //   return this.restaurantsService.searchRestaurants(filters);
    // }
}
