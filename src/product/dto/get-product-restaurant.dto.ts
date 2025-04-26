import {IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class GetProductRestaurantDto {
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
    @Type(() => String)
    @IsString()
    subcategoryId?: string

    @IsOptional()
    @Type(() => String)
    @IsString()
    size?: string

    @IsOptional()
    @Type(() => String)
    @IsString()
    sessionId?: string
}