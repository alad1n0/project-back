import { Controller, Patch, Get, Delete, Body } from '@nestjs/common';
import { BasketService } from './basket.service';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Auth()
  @Patch()
  upsert(
    @CurrentUser() user: User,
    @Body() dto: UpdateBasketDto,
  ) {
    return this.basketService.upsertItem(user.id, dto);
  }

  @Auth()
  @Get()
  getAll(@CurrentUser() user: User) {
    return this.basketService.getAll(user.id);
  }

  @Auth()
  @Delete()
  clear(@CurrentUser() user: User) {
    return this.basketService.clear(user.id);
  }

  @Auth()
  @Delete('many')
  removeMany(
    @CurrentUser() user: User,
    @Body('ids') ids: string[],
  ) {
    return this.basketService.removeMany(user.id, ids);
  }
}
