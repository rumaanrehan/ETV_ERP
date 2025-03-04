import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingSwitcherComponent } from './components/landing-switcher/landing-switcher.component';
//import { LoaderComponent } from './components/loader/loader.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { TabToTopComponent } from './components/tab-to-top/tab-to-top.component';
import { AppshowcodeDirective } from './layouts/directives/appshowcode.directive';
import { FullscreenDirective } from './layouts/directives/fullscreen.directive';
import { HoverEffectSidebarDirective } from './layouts/directives/hover-effect-sidebar.directive';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { CustomService } from './services/custom.service';
import { ZFormControlsModule } from './components/z-form-controls/z-form-controls.module';
import { AppSidebarComponent } from './components/app-sidebar/app-sidebar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    HomeLayoutComponent,
    SwitcherComponent,
    PageHeaderComponent,
    TabToTopComponent,
    //LoaderComponent,
    FooterComponent,
    FullscreenDirective,
    HoverEffectSidebarDirective,
    AppshowcodeDirective,
    LandingSwitcherComponent
  ],

  imports: [
    CommonModule,
    RouterModule,
    SimplebarAngularModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    NgbModule,
    AppSidebarComponent
  ],
  exports: [
    //RouterModule,
    HeaderComponent,
    SidebarComponent,
    HomeLayoutComponent,
    SwitcherComponent,
    PageHeaderComponent,
    TabToTopComponent,
    //LoaderComponent,
    FooterComponent,
    FullscreenDirective,
    AppshowcodeDirective,
    HoverEffectSidebarDirective,
    LandingSwitcherComponent,
    AppSidebarComponent
  ],
  providers: [ColorPickerService, CustomService]
})

export class SharedModule { }
