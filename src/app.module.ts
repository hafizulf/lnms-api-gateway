import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserGatewayModule } from './modules/user/user.gateway.module';
import { EnvValidationOptions, EnvValidationSchema } from './config/env-validation.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvValidationSchema,
      validationOptions: EnvValidationOptions,
      envFilePath: [`.env.${process.env.NODE_ENV || 'local'}`, '.env'],
    }),
    UserGatewayModule, // Handles forwarding to User Service
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
