import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet, UrlSerializer, provideRouter } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/common/global-error-handler';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { CustomService } from './shared/services/custom.service';
import { LowerCaseUrlSerializer } from './core/utility/lower-case-url-serializer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { register } from 'module';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeEn)
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authTokenInterceptor, httpErrorInterceptor])
    ),
    provideRouter(routes),
    RouterOutlet,
    ColorPickerModule,
    ColorPickerService,
    ToastrService,
    importProvidersFrom(
      CustomService,
      FlatpickrModule.forRoot(),
      ToastrModule.forRoot(),
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),
      BrowserAnimationsModule
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
    { provide: LOCALE_ID, useValue: 'en-US'},
    provideAnimationsAsync(),
  ],
};
