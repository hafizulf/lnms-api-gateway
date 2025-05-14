import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ServiceUrlUtils } from "../common/utils/service-url.utils";
import { BookGatewayController } from "./book.gateway.controller";

@Module({
  imports: [HttpModule],
  controllers: [BookGatewayController],
  providers: [ServiceUrlUtils],
})
export class BookGatewayModule {}
