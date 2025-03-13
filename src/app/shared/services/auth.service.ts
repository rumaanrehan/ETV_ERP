import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../environments/environment';
import { DTO } from '../models/dto.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  login(dto: DTO): Observable<any> {
    console.log(dto)
    return this.http.post(`${this.apiUrl}Angular/authenticate`, dto);
  }

  getmodule(): Observable<any> {
    //const authToken = localStorage.getItem('authToken');
    //// Set the Authorization header with the Bearer token
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.get(`${this.apiUrl}Angular/getmodules`);
  }
}
