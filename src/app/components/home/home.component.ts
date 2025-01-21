import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/auth.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public moduleList: any = [];
  constructor(
    private authService: AuthenticationService,
  ) {
  }
  ngOnInit(): void {
    //this.getModuleList();
    this.moduleList = [
      { ImagePath: 'Admin.svg', ModuleName: 'Admin' },
      { ImagePath: 'Billing.svg', ModuleName: 'Billing' },
      { ImagePath: 'Doctor.svg', ModuleName: 'Doctor' },
      { ImagePath: 'HealthCard.svg', ModuleName: 'Health Card' },
      { ImagePath: 'HR.svg', ModuleName: 'HRMS' },
      { ImagePath: 'Insurance.svg', ModuleName: 'Insurance' },
      { ImagePath: 'Lab.svg', ModuleName: 'Laboratory' },
      { ImagePath: 'Nurse.svg', ModuleName: 'Nurse' },
      { ImagePath: 'Patients.svg', ModuleName: 'Patient' },
      { ImagePath: 'Payroll.svg', ModuleName: 'Payroll' },
      { ImagePath: 'Radiology.svg', ModuleName: 'Radiology' },
      { ImagePath: 'BDP.svg', ModuleName: 'BDP' },
      { ImagePath: 'Ward.svg', ModuleName: 'Ward' },
    ]
  }

  getModuleList() {
    this.authService.getmodule().subscribe(
      {
        next: (response: any) => {
          this.moduleList = response;
        }
      }
    );
  }

  getFileName(path: string): string {
    return path.split('/').pop() || '';
  }

  getExternalUrl(moduleCode: string): string {
    // Construct the URL for redirection
    return `http://localhost:64820/Helper/RedirectToModules?ModuleCode=${moduleCode}`;
  }
}
