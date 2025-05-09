import { Controller, Post, Body, Headers, UseGuards, Req } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthResgisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthMeDTO } from "./dto/auth-me.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorators";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}
    
    @Post('login')
    async login(@Body() {email, password}: AuthLoginDTO) {
        return this.authService.login(email, password)
    }

    @Post('register')
    async register(@Body() body: AuthResgisterDTO) {
        return this.authService.register(body)
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO) {
        return this.authService.forget(email)
    }

    @Post('reset')
    async reset(@Body() {password, token}: AuthResetDTO) {
        return this.authService.reset(password, token)
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() user) {
        
        return {user} //this.authService.checkToken((token ?? "").split(' ')[1])
    }
}