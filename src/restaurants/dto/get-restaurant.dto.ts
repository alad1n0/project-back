import {IsNumber, IsOptional} from "class-validator";
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
}