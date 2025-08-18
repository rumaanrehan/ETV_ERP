import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, defaultIfEmpty, filter, finalize, Observable, of, Subject, switchMap, take, takeUntil, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RequestContextService {
  private readonly ACCESS_TOKEN_KEY = '__zctx_atkn__';

  private destroy$ = new Subject<void>();

  private _fingerprintHash: string | null = null;
  private _accessToken: string | null = null;

  public isRefreshing = false;
  public readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);

  // Signal to represent whether token refresh has failed
  readonly tokenRefreshFailed = signal(false);

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Access Token
  get AccessToken(): string | null {
    if (!this._accessToken) {
      this._accessToken = this.getCookie(this.ACCESS_TOKEN_KEY);
    }
    return this._accessToken;
  }

  ResetAccessToken(): void {
    this._accessToken = null;
  }

  // Clear all tokens (e.g., on logout)
  ClearTokens(): void {
    this.ResetAccessToken();
  }

  RefreshAccessToken(): Observable<string> {
    const returnUrl = window.location.pathname + window.location.search;

    return this.userService.RefreshToken({
      AccessToken: this.AccessToken!
    }).pipe(
      takeUntil(this.destroy$),
      defaultIfEmpty(null),
      switchMap(response => {
        if (!response?.IsSuccess) {
          return throwError(() => new Error('Refresh token failed'));
        }

        this.refreshTokenSubject.next(this.AccessToken);

        return of(this.AccessToken!); // Pass new token downstream
      }),
      catchError(() => {
        this.ClearTokens();
        this.tokenRefreshFailed.update(v => !v);
        this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
        return of(''); // Return empty token to continue the stream
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  async GetDeviceFingerprint(): Promise<string> {
    if (!this._fingerprintHash) {
      this._fingerprintHash = await this.takeImpression();
    }
    return this._fingerprintHash;
  }

  // Private methods
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null; // SSR safety
    }

    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  private async takeImpression(): Promise<string> {
    try {
      if (typeof window === "undefined")
        return this.GenerateGUID();

      const fingerprintData: Record<string, string> = {
        userAgent: navigator.userAgent,
        platform: (navigator as any).userAgentData?.platform || navigator.platform || "unknown",
        cpuCores: navigator.hardwareConcurrency.toString(),
        touchSupport: navigator.maxTouchPoints.toString(),
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled.toString(),
        doNotTrack: navigator.doNotTrack || "unknown",
        deviceMemory: (navigator as any).deviceMemory ? String((navigator as any).deviceMemory) : "unknown",
        colorDepth: screen.colorDepth.toString(),
        pixelDepth: screen.pixelDepth.toString(),
        screenResolution: `${screen.width}x${screen.height}`,
        screenOrientation: screen.orientation.type,
        indexedDB: this.CheckIndexedDBAvailability(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        webGL: this.GetWebGLInfo(),
        canvas: this.GetCanvasFingerprint(),
        audio: this.GetAudioFingerprint()
      };

      const fp1 = await this.Encrypt_sha256(Object.values(fingerprintData).join("||"));
      const fp2 = await this.Encrypt_sha256(fp1);

      return fp2;
    }
    catch (error) {
      return this.GenerateGUID();
    }
  }

  private async Encrypt_sha256(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
      return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    catch (error) {
      return this.GenerateGUID();
    }
  }

  private GenerateGUID(): string {
    try {
      return crypto.randomUUID();
    }
    catch (error) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }

  private CheckIndexedDBAvailability(): string {
    return !!window.indexedDB ? "Supported" : "Not Supported";
  }

  private GetWebGLInfo(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const debugInfo = (gl as any)!.getExtension('WEBGL_debug_renderer_info');
      const vendor = (gl as any)!.getParameter(debugInfo!.UNMASKED_VENDOR_WEBGL);
      const renderer = (gl as any)!.getParameter(debugInfo!.UNMASKED_RENDERER_WEBGL);
      return `${vendor}::${renderer}`;
    }
    catch (error) {
      return 'unsupported';
    }
  }

  private GetCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx!.textBaseline = 'top';
      ctx!.font = '14px Arial';
      ctx!.fillStyle = '#f60';
      ctx!.fillRect(0, 0, 100, 100);
      ctx!.fillStyle = '#069';
      ctx!.fillText('Fingerprint', 2, 2);
      return canvas.toDataURL();
    }
    catch (error) {
      return 'unsupported';
    }
  }

  private GetAudioFingerprint(): string {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      return analyser.frequencyBinCount.toString();
    }
    catch (error) {
      return "unsupported";
    }
  }
}