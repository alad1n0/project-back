import {IsOptional, IsString} from "class-validator";

export class ActionsFavoriteDto {
    @IsOptional()
    @IsString()
    restaurantId: string;
}