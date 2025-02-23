import { Controller, Get, Inject, InternalServerErrorException } from "@nestjs/common";
import { UserGatewayServiceInterface } from "./user.gateway.service.interface";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller('users')
export class UserGatewayController {
  private userService: UserGatewayServiceInterface;

  constructor(@Inject('USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserGatewayServiceInterface>('UserService');
  }

  @Get()
  async findUsers() {
    try {
      const users$ = this.userService.findUsers({});
      // gRPC methods return Observables, so we use lastValueFrom(users$) to convert them to Promises.
      return await lastValueFrom(users$);
    } catch (error) {
      console.error('User Service Error:', error.message); // Log for debugging
      throw new InternalServerErrorException('User service is unavailable.');
    }
  }
}
