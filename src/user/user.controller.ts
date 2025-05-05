import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";
import { CreatUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";


@Controller('users')
export class UserController {
    @Post()
    async create(@Body() {email, name, password}: CreatUserDTO) {
        return {email, name, password};
    }
    
    @Get()
    async list() {
        return {users:[]}
    }

    @Get(':id')
    async show(@Param('id', ParseIntPipe) id: number) {
        return {user:{}, id}
    }

    @Put(':id')
    async update(@Body() {email, name, password}: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number) {
        return {
            method: 'put',
            email, name, password,
            id
        }
    }

    @Patch(':id')
    async updatePartial(@Body() {email, name, password}: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number) {
        return {
            method: 'patch',
            email, name, password,
            id
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return {
            id
        }
    }
}
