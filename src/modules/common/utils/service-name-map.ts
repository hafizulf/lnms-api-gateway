import { ConfigService } from "@nestjs/config";
import { SERVICE_CONST } from "src/modules/common/const/service-const";

export const getServiceNameMap = (
  configService: ConfigService,
): Record<string, string> => {
  const entries = [
    SERVICE_CONST.USER_SERVICE_HTTP_URL,
    SERVICE_CONST.BOOK_SERVICE_HTTP_URL,
    // Add more env vars here
  ];

  const map: Record<string, string> = {};

  for (const envKey of entries) {
    const rawUrl = configService.get<string>(envKey);
    if (!rawUrl) continue;

    const normalizedUrl = normalizeUrl(rawUrl);
    const serviceName = toReadableServiceName(envKey);

    map[normalizedUrl] = serviceName;
  }

  return map;
};

function normalizeUrl(raw?: string): string {
  if (!raw) return '';
  const url = raw.startsWith('http') ? raw : `http://${raw}`;
  return url.replace(/\/+$/, '');
}

function toReadableServiceName(envKey: string): string {
  return (
    envKey
      .replace(/_SERVICE_HTTP_URL$/, '') // remove suffix
      .replace(/^.+?_/, '') // optional: remove "APP_", "SERVICE_", etc.
      .toLowerCase()
      .replace(/_/g, ' ') // make it human-readable
      .replace(/\b\w/g, (char) => char.toUpperCase()) + ' Service' // capitalize
  );
}

