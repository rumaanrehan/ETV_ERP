import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = Environment.apiUrl;
  }

  // Generic GET request
  get<T>(endpoint: string, params?: any): Observable<T> {
    const options = {
      headers: this.getHeaders(),
      params: this.getParams(params)
    };

    return this.http.get<T>(`${this.apiUrl}${endpoint}`, options)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  // Generic POST request
  blobPost(endpoint: string, body: any) {
    return this.http.post(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Generic PUT request
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Generic DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Generic File Upload request
  uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
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
        catchError(this.handleError)
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
  private handleError(error: any): Observable<never> {
    throw error;
  }
  // private handleError(error: any): Observable<never> {
  //   let errorMessage: string;
    
  //   if (error.error instanceof ErrorEvent) {
  //     // Client-side error
  //     errorMessage = `Client-side error: ${error.error.message}`;
  //   } else {
  //     // Server-side error
  //     errorMessage = `Server-side error: ${error.status} - ${error.message}`;
  //   }
    
  //   console.error(errorMessage);
  //   return throwError(() => new Error(errorMessage));
  // }


  //OLD Code
  // 
  /*
    get<T>(endpoint: string, params?: any): Observable<T> {
      return this.http
        .get<T>(`${this.apiUrl}${endpoint}`, { params })
        .pipe(catchError(this.handleError));
    }

    post<T>(endpoint: string, body: any, options: any = {}): Observable<T> {
      return this.http
        .post<T>(`${this.apiUrl}${endpoint}`, body, options)
        .pipe(catchError(this.handleError));
    }

    put<T>(endpoint: string, body: any): Observable<T> {
      return this.http
        .put<T>(`${this.apiUrl}${endpoint}`, body)
        .pipe(catchError(this.handleError));
    }

    delete<T>(endpoint: string, params?: any): Observable<T> {
      return this.http
        .delete<T>(`${this.apiUrl}${endpoint}`, { params })
        .pipe(catchError(this.handleError));
    }
        
    uploadFile<T>(endpoint: string, file: File): Observable<T> {
      const formData = new FormData();
      formData.append('file', file);

      return this.http
        .post<T>(`${this.apiUrl}${endpoint}`, formData)
        .pipe(catchError(this.handleError));
    }
  */
}
