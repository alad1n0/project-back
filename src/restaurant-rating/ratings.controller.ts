import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RestaurantRating } from '@prisma/client';



@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(@Body() body: { userId: string; restaurantId: string; rating: number }) {
    return this.ratingsService.createRating(body.userId, body.restaurantId, body.rating);
  }

  @Get()
  findAll() {
    return this.ratingsService.findAllRatings();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingsService.findRatingById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<RestaurantRating>) {
    return this.ratingsService.updateRating(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingsService.removeRating(id);
  }
}
