import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ServiceUnavailableException,
} from "@nestjs/common";
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
      console.error('User Service gRPC Error:', error.message);

      if (error.code === 14) {
        throw new ServiceUnavailableException('User service is unavailable.');
      }

      throw new InternalServerErrorException('Unexpected error occurred.');
    }
  }

  @Post()
  async createUser(@Body() userData: any) {
    const response = await this.httpService.axiosRef.post(
      `${this.userServiceHttpUrl}/users`,
      userData,
    );

    return response.data;
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: any,
  ) {
    const response = await this.httpService.axiosRef.put(
      `${this.userServiceHttpUrl}/users/${id}`,
      userData,
    );

    return response.data;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const response = await this.httpService.axiosRef.delete(
      `${this.userServiceHttpUrl}/users/${id}`,
    );

    return response.data;
  }
}
