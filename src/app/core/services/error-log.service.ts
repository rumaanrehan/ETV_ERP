import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface ErrorLog {
  Message: string;
  Stack: string | null;
  Time: Date;             // ISO string
  UserAgent: string;
  Url: string;
  Route: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {
  private readonly endpoint = 'System';

  constructor(
    private apiService: ApiService
  ) { }

  logError(error: any): void {
    const request: ErrorLog = {
      Message: error?.message || error?.toString() || 'Unknown error',
      Stack: error?.stack || null,
      Time: new Date(),
      UserAgent: navigator.userAgent,
      Url: window.location.href,
      Route: window.location.pathname
    };

    console.log(request);
    //
    this.apiService.post<ErrorLog>(`${this.endpoint}/LogClientError`, request, true).subscribe({
      next: () => console.info('Client error logged.'),
      error: err => console.error('Failed to log client error:', err)
    });
  }
}