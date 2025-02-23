import { Observable } from 'rxjs';
import { FindUsersResponseDto } from './dto/find-users.dto';

export interface UserGatewayServiceInterface {
  findUsers({}): Observable<FindUsersResponseDto>;
}
