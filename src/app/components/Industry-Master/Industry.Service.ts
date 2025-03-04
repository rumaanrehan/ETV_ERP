import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Industry } from './IndustryUtils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceIndustryMaster {
  // industries: any[] = [];

  constructor(private http: HttpClient) {}

  // Fetch industries from API........................
  getIndustries(): Observable<Industry[]> {
    return this.http.get<Industry[]>('https://localhost:44316/api/industries');
  }

  CreateIndustry(model: Industry) {
    return this.http
      .post('https://localhost:44316/api/industries', model)
      .subscribe(
        (res: any) => {
          console.log('Industry created successfully:', res);
          alert('Industry created successfully!');
          this.getIndustries();

          //   model = { industryCode: '', industryName: '', isActive: 'true' };
        },
        (error) => {
          console.error('Error creating industry:', error);
          alert('Failed to create industry. Please try again.');
        }
      );
  }
}
