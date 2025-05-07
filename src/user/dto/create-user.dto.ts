import { IsDateString, IsEmail, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreatUserDTO {
    
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsDateString()
    birthAt: string;
}