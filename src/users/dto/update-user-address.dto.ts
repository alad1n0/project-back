import {IsBoolean, IsOptional, IsString} from "class-validator";

export class UpdateUserAddressDto {
    @IsOptional()
    @IsString()
    city?: string

    @IsOptional()
    @IsString()
    locality?: string

    @IsOptional()
    @IsString()
    street?: string

    @IsOptional()
    @IsString()
    house?: string

    @IsOptional()
    @IsString()
    flat?: string

    @IsOptional()
    @IsString()
    floor?: string

    @IsOptional()
    @IsString()
    apartment?: string

    @IsOptional()
    @IsString()
    comment?: string

    @IsOptional()
    @IsString()
    type?: string

    @IsOptional()
    @IsBoolean()
    isMain?: boolean
}