import { IsString } from 'class-validator';

export class UpdateUserPhoneDto {
    @IsString()
    phone?: string;

    @IsString()
    otp?: string;
}