import {APP_GUARD} from '@nestjs/core';
import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
     ttl: 60,
     limit: 100,
     // permitindo o acesso ao googlebot ignoreUserAgents: [/googlebot/gi]
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule) 
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD, 
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
