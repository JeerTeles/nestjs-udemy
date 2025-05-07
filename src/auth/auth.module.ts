import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [JwtModule.register({
        secret: `w.P8h7,SmleCQdFyz5X;WUr-,WP7ClhV`
    })]
})
export class AppModule {

}