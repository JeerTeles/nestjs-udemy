import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModules } from './user/user.modules';

@Module({
  imports: [UserModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
