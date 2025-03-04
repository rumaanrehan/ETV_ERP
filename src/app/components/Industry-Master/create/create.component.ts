import { Industry } from './../IndustryUtils';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceIndustryMaster } from '../Industry.Service';
@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-industry-master',
  templateUrl: '../create/create.component.html',
  styleUrls: ['../create/create.component.scss'],
})
export class CreateIndustryMasterComponent implements OnInit {
  industry: Industry = {
    industryId: 0,
    industryCode: '',
    industryName: '',
    isActive: 'true',
  };

  industries: any[] = [];

  constructor(private industyService: ServiceIndustryMaster) {}

  // Fetch industries from API
  getIndustries() {
    this.industyService.getIndustries();
  }

  ngOnInit(): void {
    this.getIndustries();
  }

  onSubmit() {
    console.log('Creating Industry:', this.industry);

 
    if (!this.industry.industryCode || !this.industry.industryName) {
      alert('Please fill in all fields.');
      return;
    }

    this.industyService.CreateIndustry(this.industry);

    this.industry = {
      industryId: 0,
      industryCode: '',
      industryName: '',
      isActive: 'true',
    };
  }
}