import { Body, Controller, Get, Inject, InternalServerErrorException, Post, UnprocessableEntityException } from "@nestjs/common";
import { UserGatewayServiceInterface } from "./user.gateway.service.interface";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Controller('users')
export class UserGatewayController {
  private userService: UserGatewayServiceInterface;
  private userServiceHttpUrl: string;

  // Executed immediately when the class is instantiated.
  // Useful for assigning values that do not depend on external dependencies.
  constructor(
    @Inject('USER_SERVICE') private client: ClientGrpc,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const rawUrl = this.configService.get<string>(
      'USER_SERVICE_HTTP_URL',
    ) as string;
    this.userServiceHttpUrl = rawUrl.startsWith('http')
      ? rawUrl
      : `http://${rawUrl}`;
  }

  // onModuleInit() is a built-in lifecycle hook - Runs after NestJS initializes the module.
  // Used when a property depends on a service that requires initialization
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
      console.error('User Service Error:', error.message);
      throw new InternalServerErrorException('User service is unavailable.');
    }
  }

  @Post()
  async createUser(@Body() userData: any) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.userServiceHttpUrl}/users`,
        userData,
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 422) {
        throw new UnprocessableEntityException(error.response.data);
      }

      console.error('Error creating user:', error.message);
      throw new InternalServerErrorException('Failed to create user.');
    }
  }
}
