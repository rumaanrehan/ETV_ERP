import { HttpHeaders } from '@angular/common/http';

export class HttpUtils {
  static getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  static getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }
}
