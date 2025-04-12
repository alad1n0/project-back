import {IsBoolean, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class GetRestaurantDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @IsOptional()
    @Type(() => String)
    @IsString()
    categoryId?: string

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isFreeDelivery?: boolean;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    sortByPopularity?: boolean;
}