import {IsOptional, IsString} from "class-validator";

export class OauthDto {
    @IsString()
    @IsOptional()
    providerId: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    provider: string;
}