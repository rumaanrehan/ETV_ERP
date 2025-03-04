import { Industry } from './../IndustryUtils';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceIndustryMaster } from '../Industry.Service';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-industry-master',
  templateUrl: '../index/index.component.html',
  styleUrls: ['../index/index.component.scss'],
})
export class IndustryMasterIndexComponent implements OnInit {
  industries: Industry[] = [];

  constructor(private industryService: ServiceIndustryMaster) {}

  getIndustries() {
    this.industryService.getIndustries().subscribe(
      (res: any[]) => {
        console.log('Industries received:', res);

        this.industries = res.map((industry) => ({
          industryId: industry.IndustryId,
          industryCode: (industry.IndustryCode || '').trim(),
          industryName: (industry.IndustryName || '').trim(),
          isActive:
            (industry.IsActive || '').trim() === 'true' ? 'Active' : 'Inactive', 
        }));
      },
      (error) => {
        console.error('Error fetching industries:', error);
      }
    );
  }

  ngOnInit(): void {
    this.getIndustries();
  }
}
