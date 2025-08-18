import { effect, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { AES, enc } from 'crypto-js';
import { Environment } from '../../../environments/environment';
import { UserService } from './user.service';
import { Subject, takeUntil } from 'rxjs';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';
import { RequestContextService } from './request-context.service';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private readonly clientSecretKey: string = Environment.clientSecretKey;
  private readonly USER_KEY = '__zctx_uinf__';

  private destroy$ = new Subject<void>();

  readonly _user = signal<User | null>(null);

  constructor(
    private userService: UserService,
    private requestContextService: RequestContextService,
    private alertService: AlertNotificationService
  ) {
    effect(() => {
      if (this.requestContextService.tokenRefreshFailed()) {
        this.clearUser();
      }
    }, { allowSignalWrites: true });

    // 🔄 Listen for cross-tab user data changes
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public rehydrate(): void {
    this.rehydrateUserFromStorage();
  }

  private rehydrateUserFromStorage(): void {
    const user = this.getItem_SecureStorage<User>(this.USER_KEY);
    if (user) {
      this.setUser(user);
      return; // ✅ Successfully restored
    }

    // Local restore failed — fallback to API
    this.userService.GetProfile()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.setUser(response.Data);
          }
          else {
            this.alertService.showServerErrorAlert({
              type: "warning",
              title: "Warning Message",
              text: "<b>Unable to load user information.<b/> Please try refreshing the page.",
            });
          }
        },
        error: () => {
          this.alertService.showServerErrorAlert({
            type: "warning",
            title: "Warning Message",
            text: "<b>Unable to load user information.<b/> Please try refreshing the page.",
          });
        },
        complete: () => {
          // this._IsRehydrateding = false;
        }
      });
  }

  get user(): User | null {
    return this._user();
  }

  setUser(user: User): void {
    this._user.set(user);
    this.setItem_SecureStorage(this.USER_KEY, user);
  }

  clearUser(): void {
    this._user.set(null);
    this.removeItem_SecureStorage(this.USER_KEY);
  }

  // isLoggedIn(): boolean {
  //   return !!this._user();
  // }

  // Privcate methods
  private encrypt(value: any): string {
    const stringValue = JSON.stringify(value);
    return AES.encrypt(stringValue, this.clientSecretKey).toString();
  }

  private decrypt(cipherText: string): any {
    try {
      const bytes = AES.decrypt(cipherText, this.clientSecretKey);
      const decrypted = bytes.toString(enc.Utf8);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  setItem_SecureStorage(key: string, value: any): void {
    const encrypted = this.encrypt(value);
    localStorage.setItem(key, encrypted);
  }

  getItem_SecureStorage<T>(key: string): T | null {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return this.decrypt(encrypted) as T;
  }

  removeItem_SecureStorage(key: string): void {
    localStorage.removeItem(key);
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === this.USER_KEY) {
      this.rehydrateUserFromStorage();
    }
  }
}