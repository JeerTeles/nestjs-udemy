import {APP_GUARD} from '@nestjs/core';
import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter} from '@nestjs-modules/mailer/dist/adapters/pug.adapter'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
     ttl: 60,
     limit: 100,
     // permitindo o acesso ao googlebot ignoreUserAgents: [/googlebot/gi]
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: 'rodrigo56@ethereal.email',
            pass: '1HF4Wm88aDxg9tD62a'
          }
        },
        defaults: {
          from: '"JeerDev" <rodrigo56@ethereal.email',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }), 
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD, 
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
