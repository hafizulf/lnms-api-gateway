import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { UserGatewayController } from "./user.gateway.controller";
import { ServiceUrlUtils } from "../common/utils/service-url.utils";

@Module({
  imports: [
    HttpModule, // Required for REST calls
  ],
  controllers: [UserGatewayController],
  providers: [
    ServiceUrlUtils,
  ],
})
export class UserGatewayModule {}
