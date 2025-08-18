import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { Environment } from '../../../environments/environment';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private alertService: AlertNotificationService
  ) {
    this.apiUrl = Environment.apiUrl;
  }

  // Generic GET request
  get<T>(endpoint: string, params?: any, skipGlobalErrorHandling: boolean = false): Observable<T> {
    const options = {
      headers: this.getHeaders(),
      params: this.getParams(params)
    };

    return this.http.get<T>(`${this.apiUrl}${endpoint}`, options)
      .pipe(
        catchError((error) => {
          return this.handleError(error, skipGlobalErrorHandling);
        })
      );
  }

  // Generic POST request
  post<T>(endpoint: string, body: any, skipGlobalErrorHandling: boolean = false): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError((error) => {
        return this.handleError(error, skipGlobalErrorHandling);
      })
    );
  }

  // Generic POST request
  blobPost(endpoint: string, body: any, skipGlobalErrorHandling: boolean = false) {
    return this.http.post(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
      withCredentials: true,
      responseType: 'blob'
    }).pipe(
      catchError((error) => {
        return this.handleError(error, skipGlobalErrorHandling);
      })
    );
  }


  // Generic PUT request
  put<T>(endpoint: string, body: any, skipGlobalErrorHandling: boolean = false): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        return this.handleError(error, skipGlobalErrorHandling);
      })
    );
  }

  // Generic DELETE request
  delete<T>(endpoint: string, skipGlobalErrorHandling: boolean = false): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        return this.handleError(error, skipGlobalErrorHandling);
      })
    );
  }

  // Generic File Upload request
  uploadFile<T>(endpoint: string, file: File, additionalData?: any, skipGlobalErrorHandling: boolean = false): Observable<T> {
    const formData = new FormData();

    // Append the file to FormData
    formData.append('file', file, file.name);

    // Append additional data if provided
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    // For file uploads, we don't set Content-Type manually as FormData handles it
    // Your interceptor will still add the authentication token
    const headers = new HttpHeaders(); // Empty headers, let FormData set boundary

    return this.http.post<T>(`${this.apiUrl}${endpoint}`, formData, { headers })
      .pipe(
        catchError((error) => {
          return this.handleError(error, skipGlobalErrorHandling);
        })
      );
  }

  downloadFile(endpoint: string, params?: any, skipGlobalErrorHandling: boolean = false): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params: this.getParams(params),
      responseType: 'blob'
    }).pipe(
      catchError((error) => {
        return this.handleError(error, skipGlobalErrorHandling);
      })
    );
  }

  // Set up common headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // No need to set Authorization header here as it's handled by interceptor
    });
  }

  // Convert params object to HttpParams
  private getParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, String(params[key]));
        }
      });
    }
    return httpParams;
  }

  // Error handling
  private handleError(error: any, skipGlobalErrorHandling: boolean = false): Observable<never> {
    if (skipGlobalErrorHandling) {
      return throwError(() => error);
    }

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          this.handleBadRequest(error);
          break;

        case 401: //SessionExpired
          // This is handled by the auth interceptor
          break;

        case 403: //AccessDenied
          alert('HTTP Interceptor Error 403');
          break;

        case 404: //NotFound
          alert('HTTP Interceptor Error 404');
          break;

        case 530: //HTTPError
          alert('HTTP Interceptor Error 530');
          break;

        default:
          this.alertService.showServerErrorAlert({ text: `Error Code: ${error.status}\nMessage: ${error.error?.errorDetail ?? error.message}` });
      }
      return EMPTY;
    }
    else {
      throw error;
    }
  }

  private handleBadRequest(error: HttpErrorResponse) {
    let validationMessages = 'The request could not be processed due to an unexpected issue.';
    if (error.error && typeof error.error === 'object') {
      if (error.error.errors) {
        validationMessages = `
          <ul>
            ${Object.keys(error.error.errors)
            .map(key => `<li>${key}: ${error.error.errors[key].join(', ')}</li>`
            ).join('')}
          </ul>
        `;
      }
    }
    this.alertService.showServerErrorAlert({
      title: 'Bad Request',
      text: validationMessages
    });
  }
}
