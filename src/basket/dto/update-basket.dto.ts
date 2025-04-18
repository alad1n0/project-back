import { IsUUID, IsInt, Min } from 'class-validator';

export class UpdateBasketDto {
  @IsUUID()
  productCategoryId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  @Min(0)
  quantity: number;
}
