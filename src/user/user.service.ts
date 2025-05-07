import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";

@Injectable()
export class UserService {
    
    constructor(private readonly prisma: PrismaService) {

    }

    async create(data: CreatUserDTO) {
        return this.prisma.users.create({
            data: data
        })
    }

    async listUsers() {
        return this.prisma.users.findMany()
    }

    async listUserId(id: number) {

        return this.prisma.users.findUnique({
            where: {
                id
            }
        })
    }

    async update(id: number, {email, name, password, birthAt}: UpdatePutUserDTO) {

        await this.dontExist(id)
      
        return this.prisma.users.update({
            data: {email, name, password, birthAt: birthAt ? new Date(birthAt) : null},
            where: {
                id
            }
        })
    }

    async updatePartial(id: number, {email, name, password, birthAt}: UpdatePatchUserDTO) {
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

        if (password) {
            data.password = password
        }

        return this.prisma.users.update({
            data,
            where: {
                id
            }
        })
    }

    async delete(id: number) {
        /*const  userId = this.listUserId(id)
        if(! await userId) {
            throw new NotFoundException (`user with id ${id} does not exist`)
        }*/

        await this.dontExist(id)

        return this.prisma.users.delete({
            where: {
                id
            }
        })
    }

    async dontExist(id: number) {
        const  userId = this.listUserId(id)
        if(! await userId) {
            throw new NotFoundException (`user with id ${id} does not exist`)
        }
    }
}