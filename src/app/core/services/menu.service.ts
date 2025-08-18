import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';
import { BreadcrumbTrail, Menu } from '../models/menu';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Module Code List
  public readonly moduleList: string[] = ['admin', 'ie', 'ims'];

  // Store the current module code
  moduleCode = signal<string | null>(null);

  // Store the menu dynamically based on the module
  menu = signal<Menu[]>([]);

  // Store the breadcrumbs dynamically based on the route
  breadcrumbs = signal<BreadcrumbTrail[]>([]);

  constructor(
    private userService: UserService,
    private alertService: AlertNotificationService
  ) { }

  // Load menu based on module code
  loadMenu(module: string) {
    this.menu.set([]);

    if (!module) return;

    this.userService.GetMenu(module)
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            console.log('Menu loaded:', response.Data.Items);
            this.menu.set(response.Data.Items);
          }
          else {
            this.alertService.showServerErrorAlert({
              type: "warning",
              title: "Warning Message",
              text: "<b>Unable to load menu.<b/> Please try refreshing the page.",
            });
          }
        },
        error: () => {
          this.alertService.showServerErrorAlert({
            type: "warning",
            title: "Warning Message",
            text: "<b>Unable to load menu.<b/> Please try refreshing the page.",
          });
        },
        complete: () => {

        }
      });
  }



  // // Computed signal for menu: Automatically updates when moduleCode changes
  // menu = computed(() => {
  //   const module = this.moduleCode();
  //   if (!module) return [];


  //   console.log('Menu loaded:', this.getModuleCode());
  //   switch (module) {
  //     case 'HR':
  //       return [
  //         { name: 'Employee Details', route: '/HR/EmployeeDetails/Index' },
  //         { name: 'Employee Loan', route: '/HR/EmployeeLoan/Index' }
  //       ];
  //     case 'Sales':
  //       return [
  //         { name: 'Orders', route: '/Sales/Orders/List' },
  //         { name: 'Invoices', route: '/Sales/Invoices/List' }
  //       ];
  //     default:
  //       return [];
  //   }
  // });
}
