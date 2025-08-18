import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserService } from '../../core/services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public moduleList: any = [];

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    // this.getModuleList();
    this.moduleList = [
      { ModuleCode: 'Admin', Path: '/admin/home', ImagePath: 'Admin.svg', ModuleName: 'Admin', },
      { ModuleCode: 'IMS', Path: '/ims/home', ImagePath: 'IMS.png', ModuleName: 'Inventory', },
      { ModuleCode: 'IE', Path: '/ie/home', ImagePath: 'IE.svg', ModuleName: 'Import/Export', }
    ]
  }

  // getModuleList() {
  //   this.userService.Getmodule().subscribe(
  //     {
  //       next: (response: any) => {
  //         this.moduleList = response;
  //       }
  //     }
  //   );
  // }

  getFileName(path: string): string {
    return path.split('/').pop() || '';
  }
}
