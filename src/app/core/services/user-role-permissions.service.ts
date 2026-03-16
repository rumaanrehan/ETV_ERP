import { Injectable, signal } from '@angular/core';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';
import { UserPagePermissionsMap } from '../models/user';
import { UserService } from './user.service';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRolePermissionsService {
  private destroy$ = new Subject<void>();
  
  private isFetching = false;
  permissions = signal<UserPagePermissionsMap>({});

  constructor(
    private userService: UserService,
    private alertService: AlertNotificationService
  ) {
    window.addEventListener('storage', this.handleStorageChange.bind(this)); //Listens for cross-tab changes using localStorage to stay in sync.
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Check if user has permission for a specific menu action */
  async authorize(menu: string, action: 'CanCreate' | 'CanRead' | 'CanUpdate' | 'CanDelete'): Promise<'authorized' | 'unauthorized' | 'not_found'> {
    await this.waitForPermissions();
    const perms = this.permissions()[menu];
    console.log(menu);
    console.log(action);
    console.log(perms);
    if(!perms){
      return 'not_found';
    }
    else {
      return perms[action] ? 'authorized' : 'unauthorized';
    }
  }

  /** Wait until permissions are fetched */
  private async waitForPermissions(): Promise<void> {
    // If permissions already exist, return early
    if (Object.keys(this.permissions()).length > 0) return;

    // If not already fetching, trigger permission load
    if (!this.isFetching) {
      this.loadUserRolePermissions();
    }

    // Ensure `isFetching = true` has been set
    await new Promise(resolve => setTimeout(resolve, 0));

    // Start timeout tracking
    // const timeout = 20000; // 5 seconds
    // const startTime = Date.now();

    while (this.isFetching) {
      // if (Date.now() - startTime > timeout) {
      //   console.warn('⏰ waitForPermissions(): Timed out after 5 seconds.');
      //   break;
      // }
      await new Promise(resolve => setTimeout(resolve, 50)); // Wait 50ms between checks
    }
    
    
    // return new Promise((resolve) => {
    //   // If not fetching and permissions are empty, trigger a fresh load
    //   if (!this.isFetching && Object.keys(this.permissions()).length === 0) {
    //     this.loadUserRolePermissions(); // Triggers fetch and sets isFetching = true
    //   }
      
    //   // Defer the immediate check by one tick to let isFetching=true take effect
    //   setTimeout(() => {
    //     // Poll until fetching is done
    //     if (!this.isFetching) {
    //       resolve();
    //     } else {
    //       const interval = setInterval(() => {
    //         if (!this.isFetching) {
    //           clearInterval(interval);
    //           resolve();
    //         }
    //       }, 50); // Checks every 50ms
    //     }
    //   }, 0);
    // });
  }

  /** Load permissions from API */
  loadUserRolePermissions(triggeredByStorage = false) {
    if (this.isFetching) return;
    
    this.isFetching = true;
    this.permissions.set({});
    
    this.userService.GetRolePermissions() 
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response) => {
        if (response.IsSuccess) {
          let permissionMap: any = {};
          response.Data.Items.forEach(item => {
            permissionMap[item.AreaName + "/" + item.ControllerName] = {
              CanCreate: item.CanCreate,
              CanRead: item.CanRead,
              CanUpdate: item.CanUpdate,
              CanDelete: item.CanDelete
            };
          });
          this.permissions.set(permissionMap);

          if (!triggeredByStorage) {
            localStorage.setItem('__zctx_urps__', Date.now().toString());
          }
        }
        else {
          this.alertService.showServerErrorAlert({
            type: "warning",
            title: "Warning Message",
            text: "<b>Unable to load user permissions.<b/> Please try refreshing the page.",
          });
        }
      },
      error: () => {
        this.alertService.showServerErrorAlert({
          type: "warning",
          title: "Warning Message",
          text: "<b>Unable to load user permissions.<b/> Please try refreshing the page.",
        });
      },
      complete: () => {
        this.isFetching = false;
      }
    });
  }

  /** Handle changes from other tabs */
  private handleStorageChange(event: StorageEvent) {
    if (!event.key) return; // safeguard for null keys (clear() can cause this)

    if (event.key === '__zctx_urps__') {
      this.loadUserRolePermissions(true);
    }
  } 
}