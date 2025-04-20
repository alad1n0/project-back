import { IsString } from 'class-validator';

export class UpdateUserProfileDto {
    @IsString()
    firstName?: string;

    @IsString()
    lastName?: string;
}