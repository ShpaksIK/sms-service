import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from './common/validations/validation.pipe';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule.forRoot({
      config: databaseConfig(),
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
