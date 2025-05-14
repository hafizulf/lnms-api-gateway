import { HttpService } from "@nestjs/axios";
import { Controller, Get } from "@nestjs/common";
import { ServiceUrlUtils } from "../common/utils/service-url.utils";
import { SERVICE_CONST } from "../common/const/service-const";

@Controller('books')
export class BookGatewayController {
  private bookServiceHttpUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly serviceUrlUtils: ServiceUrlUtils,
  ) {
    this.bookServiceHttpUrl = this.serviceUrlUtils.getServiceUrl(SERVICE_CONST.BOOK_SERVICE_HTTP_URL);
  }

  @Get()
  async findBooks() {
    const response =  await this.httpService.axiosRef.get(`${this.bookServiceHttpUrl}/books`);

    return response.data;
  }
}
