import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";

@Injectable()
export class UserService {
    
    constructor(private readonly prisma: PrismaService) {

    }

    async create(data: CreateUserDTO) {
        return this.prisma.users.create({
            data: data
        })
    }

    async listUsers() {
        return this.prisma.users.findMany()
    }

    async listUserId(id: number) {

        await this.dontExist(id)

        return this.prisma.users.findUnique({
            where: {
                id
            }
        })
    }

    async update(id: number, {email, name, password, birthAt, role}: UpdatePutUserDTO) {

        await this.dontExist(id)
      
        return this.prisma.users.update({
            data: {email, name, password, birthAt: birthAt ? new Date(birthAt) : null, role},
            where: {
                id
            }
        })
    }

    async updatePartial(id: number, {email, name, password, birthAt, role}: UpdatePatchUserDTO) {
        const data: any = {};

        await this.dontExist(id)

        if (birthAt) {
            data.birthAt = new Date(birthAt)
        }

        if (email) {
            data.email = email
        }

        if (name) {
            data.name = name
        }

        if (role) {
            data.role = role
        }

        return this.prisma.users.update({
            data,
            where: {
                id
            }
        })
    }

    async delete(id: number) {

        await this.dontExist(id)

        return this.prisma.users.delete({
            where: {
                id
            }
        })
    }

    async dontExist(id: number) {
        if(!(await this.prisma.users.count({
            where: {
                id
            }
        }))) {
            throw new NotFoundException (`user with id ${id} does not exist`)
        }
    }
}