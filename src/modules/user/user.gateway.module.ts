import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserGatewayController } from "./user.gateway.controller";

@Module({
  imports: [
    ConfigModule, // Needed for useFactory()
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule], // Required for async provider
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(__dirname, '../../protos/user/user.proto'),
            url: configService.get<string>('USER_SERVICE_URL'), // Get from ConfigService
          },
        }),
      },
    ]),
  ],
  controllers: [UserGatewayController],
})
export class UserGatewayModule {}
