import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ServiceUrlUtils {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  getServiceUrl(serviceName: string) {
    const rawUrl = this.configService.get<string>(serviceName)!;
    return rawUrl.startsWith('http')
      ? rawUrl
      : `http://${rawUrl}`;
  }
}
