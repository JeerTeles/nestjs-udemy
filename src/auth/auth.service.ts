import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthResgisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { MailerService } from "@nestjs-modules/mailer/dist";
import { link } from "fs";

@Injectable()
export class AuthService {

    private issuer = 'login'
    private audience = 'users'
    
    constructor(
        private readonly jwtService: JwtService, 
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService
    ) {}

    createToken(user: users) {
        return {
            accessToken: this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email
            },  {
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience,
                //notBefore: Math.ceil((Date.now() + 1000 * 60 * 60) / 1000)  [Ativação do token apos uma hora]
            })
        }
    }

    checkToken(token: string) {

        try {
            const data =  this.jwtService.verify(token, {
                issuer: this.issuer,
                audience: this.audience,
            })

            return data
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token)
            return true
        } catch (e) {
            return false
        }
    }

    async login(email: string, password: string) {
        
        const user = await this.prisma.users.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            throw new  UnauthorizedException('Incorrect email and/or password')
        }

        
        if (!await bcrypt.compare(password, user.password)) {
            throw new  UnauthorizedException('Incorrect email and/or password')
        }
        
        return this.createToken(user)
    }

    async forget(email: string) {
        const user = await this.prisma.users.findFirst({
            where: {
                email,
            }
        }) 

        if(!user) {
            throw new UnauthorizedException('Incorrect email')
        }
        
        const token = this.jwtService.sign({
            id: user.id,
        }, {
            expiresIn: "30 minutes",
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users'
        })

        await this.mailer.sendMail({
            subject: 'Recuperação de senha',
            to: 'joao@hcode.com.br',
            template: 'forget',
            context: {
                name: user.name,
                token
            }
        })

        return true
    }

    async reset(password: string, token: string) {
        
        try {
            const data: any =  this.jwtService.verify(token, {
                issuer: 'forget',
                audience: 'users',
            })

            if (isNaN(Number(data.id))) {
                throw new BadRequestException('invalid token.');
            }

            const salt = await bcrypt.genSalt()
            password = await bcrypt.hash(password, salt)
        
            const user = await this.prisma.users.update({
                where: {
                    id: Number(data.id)
                },
                data: {
                    password
                }
            })

            return this.createToken(user)

        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async register (data: AuthResgisterDTO) {
        const user = await this.userService.create(data)

        return this.createToken(user)
    }
}
