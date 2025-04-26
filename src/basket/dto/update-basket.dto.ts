import {Min, IsOptional, IsString, IsNumber} from 'class-validator';

export class UpdateBasketDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  restaurantId: string;

  @IsOptional()
  @IsString()
  sessionId?: string
}
