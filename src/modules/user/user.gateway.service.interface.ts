import { Observable } from 'rxjs';

export interface UserGatewayServiceInterface {
  findUsers({}): Observable<any>;
}
