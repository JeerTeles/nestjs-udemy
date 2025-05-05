import { Injectable } from "@nestjs/common";
import { CreatUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    
    constructor(private readonly prisma: PrismaService) {

    }

    create({email, name, password}: CreatUserDTO) {

    }
}