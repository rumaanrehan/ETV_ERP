import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import * as switcher from '../switcher/switcher';
import { SwitcherService } from '../../services/switcher.service';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-landing-switcher',
  templateUrl: './landing-switcher.component.html',
  styleUrl: './landing-switcher.component.scss'
})
export class LandingSwitcherComponent {
  body: HTMLBodyElement | null;
rgb: any;
  constructor( public renderer: Renderer2,
    public switcherServic: SwitcherService,
    public navServices: NavService,
    private elementRef: ElementRef){
    this.body = document.querySelector('body');
    const htmlElement =
    this.elementRef.nativeElement.ownerDocument.documentElement;
  const bodyElement = document.body;
  }
  CheckOpe = () => {
    if (localStorage.getItem('ynex-dir') == 'rtl') {
      this.RtlChecked = true;
    }
    if (localStorage.getItem('ynex-dir') == 'rtl') {
      this.darkchecked = true;
    }
  };

  ngOnInit(): void {
 
    switcher.localStorageBackUp();
    this.CheckOpe();
  }


// Theme color Mode
themeChange(type: string, type1: string) {
  const htmlElement =
    this.elementRef.nativeElement.ownerDocument.documentElement;
  this.renderer.setAttribute(htmlElement, 'data-header-styles', type1);
  localStorage.setItem('ynexHeader', type1);
  this.renderer.setAttribute(htmlElement, 'data-menu-styles', type1);
  localStorage.setItem('ynexMenu', type1);
  this.renderer.setAttribute(htmlElement, 'data-theme-mode', type1);
  localStorage.setItem('ynexdarktheme', type1);

  if (localStorage.getItem('ynexHeader') == 'light') {
    this.elementRef.nativeElement.ownerDocument.documentElement?.removeAttribute(
      'style'
    );
  }
  
  if (localStorage.getItem('ynexdarktheme') == 'light') {
    this.elementRef.nativeElement.ownerDocument.documentElement?.removeAttribute(
      'style'
    );
    localStorage.removeItem('bodyBgRGB')
    localStorage.removeItem('bodylightRGB')
  }
  
}

//  Directions
DirectionsChange(type: string) {
  let body = document.querySelector('body');
  const htmlElement =
    this.elementRef.nativeElement.ownerDocument.documentElement;
  this.renderer.setAttribute(htmlElement, 'dir', type);
  localStorage.setItem('dir', type);

  if(htmlElement?.getAttribute('dir') == 'ltr'){
    body?.classList.remove('rtl');
  } else {
    body?.classList.add('rtl');
  }

   if (localStorage.getItem('dir') == 'ltr') {
    localStorage.removeItem('dir');
  }
  if (localStorage.getItem('dir') == 'rtl') {
    this.renderer.setAttribute(htmlElement, 'dir', type);
  }
  

}


   //Theme Primary
   primary(type: string) {
    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty(
      '--primary-rgb',
      type
    );
   
    localStorage.setItem('primaryRGB', type);
    localStorage.removeItem('ynexlight-primary-color');
  }
  color1 = '#1457e6';
    //primary theme change
    public dynamicLightPrimary(data: any): void {
      this.color1 = data.color;
  
      const dynamicPrimaryLight = document.querySelectorAll(
        'input.color-primary-light'
      );
  
      switcher.dynamicLightPrimaryColor(dynamicPrimaryLight, this.color1);
  
      localStorage.setItem('ynexlight-primary-color', switcher.hexToRgba(this.color1) || '');
      localStorage.setItem('ynexlight-primary-color1', switcher.hexToRgba(this.color1) || '');
      localStorage.setItem('ynexlight-mode', 'true');
      this.body?.classList.remove('transparent-mode');
  
      // Adding
      this.body?.classList.add('light-mode');
  
      // Removing
      this.body?.classList.remove('dark');
      this.body?.classList.remove('bg-img1');
  
      // removing data from session storage
  
      // switcher.checkOptions();
      localStorage.removeItem('ynex-primary-mode');
    }
  
  // public localDark = localStorage;
  public localdata = localStorage;
  public darkchecked: any;
  public RtlChecked: any;
  reset() {
    localStorage.clear();
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    htmlElement.removeAttribute('style');
    htmlElement.setAttribute('class', 'light');
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.setAttribute('data-nav-layout', 'horizontal');
    htmlElement.setAttribute('data-page-style', 'regular');
    htmlElement.setAttribute('data-header-styles', 'light');
    htmlElement.setAttribute('data-menu-styles', 'dark');
    htmlElement.setAttribute('bg-img', 'dark');
    htmlElement.removeAttribute('data-toggled');
    htmlElement.removeAttribute('style');
    // switcher.checkOptions();
     this.toggleExpand();
  }
  expande = false;
expande1 = false;
expande2 = false;
toggleExpand(): void {
  this.expande = !this.expande;   
 if (localStorage.getItem('data-menu-styles') == 'light') {
   document
     .querySelector('html')
     ?.setAttribute('data-menu-styles', 'light');
 } else if (localStorage.getItem('data-menu-styles') == 'dark') {
   document
     .querySelector('html')
     ?.setAttribute('data-menu-styles', 'dark');
 }
}

SwitcherClose() {
  document.querySelector('.offcanvas-end')?.classList.remove('show');
  document.querySelector('.offcanvas-end')?.classList.toggle('hidden');
}

ngOnDestroy() {
  if (localStorage.getItem('data-menu-styles') == 'light') {
    document
      .querySelector('html')
      ?.setAttribute('data-menu-styles', 'light');
  } else if (localStorage.getItem('data-menu-styles') == 'dark') {
    document
      .querySelector('html')
      ?.setAttribute('data-menu-styles', 'dark');
  }
}

}

