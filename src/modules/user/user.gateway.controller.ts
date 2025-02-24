import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseFilters,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { ParseIntExceptionFilter } from "../common/filters/parse-int-exception.filter";

@Controller('users')
export class UserGatewayController {
  private userServiceHttpUrl: string;

  // Executed immediately when the class is instantiated.
  // Useful for assigning values that do not depend on external dependencies.
  constructor(
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

  @Get()
  async findUsers() {
    const response = await this.httpService.axiosRef.get(
      `${this.userServiceHttpUrl}/users`
    );

    return response.data;
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
  @UseFilters(new ParseIntExceptionFilter())
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
  @UseFilters(new ParseIntExceptionFilter())
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const response = await this.httpService.axiosRef.delete(
      `${this.userServiceHttpUrl}/users/${id}`,
    );

    return response.data;
  }
}
