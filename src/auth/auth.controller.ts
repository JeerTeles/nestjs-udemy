import { 
    Controller, Post, Body, Headers, UseGuards, UseInterceptors,
    UploadedFile, BadRequestException, UploadedFiles, ParseFilePipe, FileTypeValidator,
    MaxFileSizeValidator
} from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthResgisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorators";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { join } from "path"
import { FileService } from "src/file/file.service";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly fileService: FileService
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

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
        @User() user,  
        @UploadedFile(new ParseFilePipe({
            validators: [
                new FileTypeValidator({fileType: 'image/png'}),
                new MaxFileSizeValidator({maxSize: 1024 * 20})
            ]
        })) photoAvatar: Express.Multer.File) {
        
        const path = join(__dirname, '..', '..', 'storage', 'photos', `photoAvatar-${user.id}.png`)

        try {
            this.fileService.upload(photoAvatar, path) 
        } catch (e) {
            throw new BadRequestException(e)
        }

        return {sucess: 'upload done successfully'}
    }

    // Fazendo upload de varios arquivos com FilesInterceptor
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user,  @UploadedFiles() files: Express.Multer.File[]) {

        return files
    }

    // Fazendo upload de varios arquivos com FileFieldsInterceptor
    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1  
    }, {
        name: 'documents',
        maxCount: 10
    }]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFilesFields(@User() user,  @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) {

        return files
    }
}