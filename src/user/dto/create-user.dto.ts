import { IsEmail, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreatUserDTO {
    
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 6,
        minNumbers: 0,
        minLowercase: 0,
        minUppercase: 0,
        minSymbols: 0
    })
    //@MinLength(6)
    password: string;
}