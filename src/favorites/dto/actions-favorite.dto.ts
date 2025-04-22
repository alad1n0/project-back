import {IsOptional, IsString} from "class-validator";

export class ActionsFavoriteDto {
    @IsOptional()
    @IsString()
    restaurantId?: string

    @IsOptional()
    @IsString()
    productId?: string

    @IsOptional()
    @IsString()
    type: string
}