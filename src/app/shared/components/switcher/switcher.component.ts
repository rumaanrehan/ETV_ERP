import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NavService } from '../../services/nav.service';
import * as switcher from './switcher';
import { SwitcherService } from '../../services/switcher.service';
import { Subscription } from 'rxjs';
import * as sidebarFn from '../sidebar/sidebar';
@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
})
export class SwitcherComponent {
  color: string = '#EC407A';

  lightMenu: any = document.querySelector('#myonoffswitch3');
  colorMenu: any = document.querySelector('#myonoffswitch4');
  darkMenu: any = document.querySelector('#myonoffswitch5');
  gradientMenu: any = document.querySelector('#myonoffswitch25');
  lightHeader: any = document.querySelector('#myonoffswitch6');
  darkHeader: any = document.querySelector('#myonoffswitch8');
  gradientHeader: any = document.querySelector('#myonoffswitch26');
  colorHeader: any = document.querySelector('#myonoffswitch7');

  layoutSub: Subscription;

  body = document.querySelector('body');

  @ViewChild('switcher', { static: false }) switcher!: ElementRef;
  isOpen: any;

  constructor(
    public renderer: Renderer2,
    public switcherServic: SwitcherService,
    public navServices: NavService,
    private elementRef: ElementRef
  ) {
    this.layoutSub = switcherServic.changeEmitted.subscribe((value) => {
      //click to open switcher
      if (value) {
        this.isOpen = document.querySelector('.switcher');
        this.isOpen.classList.value.includes('show');
        if (this.isOpen == !this.isOpen) {
          this.renderer.removeClass(this.switcher.nativeElement, 'show');
        } else {
          this.renderer.addClass(this.switcher.nativeElement, 'show');
        }
      } else {
        this.renderer.removeClass(
          this.switcher.nativeElement.firstElementChild,
          'show'
        );
        this.renderer.setStyle(
          this.switcher.nativeElement.firstElementChild,
          'show',
          '-270px'
        );
        value = false;
      }
    });

    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.removeAttribute(htmlElement, 'data-nav-style');
  }

  ngOnInit(): void {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    switcher.localStorageBackUp();
    this.closeMenu(localStorage.getItem('ynexnavstyles'));
    // htmlElement.setAttribute('data-menu-styles', 'dark');
  }

  // Theme color Mode
  themeChange(type: string, type1: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-header-styles', type1);
    localStorage.setItem('ynexHeader', type1);
    this.renderer.setAttribute(htmlElement, 'data-menu-styles', 'dark');
    localStorage.setItem('ynexMenu', type1);
    this.renderer.setAttribute(htmlElement, 'data-theme-mode', type1);
    localStorage.setItem('ynexdarktheme', type1);
    this.elementRef.nativeElement.ownerDocument.documentElement?.removeAttribute(
      'style'
    );

    if (localStorage.getItem('ynexHeader') == 'light') {
      this.elementRef.nativeElement.ownerDocument.documentElement?.removeAttribute(
        'style'
      );
    }

    if (localStorage.getItem('ynexdarktheme') == 'light') {
      this.elementRef.nativeElement.ownerDocument.documentElement?.removeAttribute(
        'style'
      );
      localStorage.removeItem('bodyBgRGB');
      localStorage.removeItem('bodylightRGB');
    }
  }

  //  Directions
  DirectionsChange(type: string) {
    let body = document.querySelector('body');
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'dir', type);
    localStorage.setItem('dir', type);

    if (htmlElement?.getAttribute('dir') == 'ltr') {
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

  //Navigation Styles:

  NavigationChange(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-nav-layout', type);
    localStorage.setItem('ynexlayout', type);
    if (type == 'vertical') {
      this.renderer.setAttribute(htmlElement, 'data-vertical-style', 'overlay');
      this.renderer.removeAttribute(htmlElement, 'data-nav-style');
      this.renderer.removeAttribute(htmlElement, 'data-toggled');
      localStorage.removeItem('ynexverticalstyles-toggled');
      localStorage.removeItem('ynexverticalstyles');
    }
    if (type == 'horizontal') {
      this.renderer.setAttribute(htmlElement, 'data-nav-style', 'menu-click');
      this.renderer.removeAttribute(htmlElement, 'data-vertical-style');
      localStorage.setItem('ynexnavstyles', 'menu-click');
    } else {
      // this.renderer.setAttribute(htmlElement, 'data-menu-styles', 'dark');
      // localStorage.removeItem('ynex-menu-style');
    }
    localStorage.setItem('ynex-nav-mode', type);
  }

  //Vertical & Horizontal Menu Styles:
  menuItems: any;
  Menus(type: string, type1: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    localStorage.setItem('ynexnavstyles', type1);
    localStorage.removeItem('ynexverticalstyles');
    this.renderer.removeAttribute(htmlElement, 'data-vertical-style');
    this.renderer.setAttribute(htmlElement, 'data-nav-style', type1);
    this.renderer.setAttribute(htmlElement, 'data-toggled', type);
    this.renderer.setAttribute(htmlElement, 'data-menu-position', 'scrollable');
  

    if (localStorage.getItem('ynexnavstyles') == 'icon-hover' || 'icon-click') {
      document
        .querySelector('.main-menu')
        ?.setAttribute('style', 'margin-left:0px');
    } else {
    }

    if (localStorage.getItem('ynexnavstyles') == 'icon-hover') {
      document
        .querySelector('.slide-menu')
        ?.setAttribute('style', 'display:none;');
    } else {
      document
        .querySelector('.slide-menu')
        ?.setAttribute('style', 'display:block;');
    }
  }

  closeMenu(type1: any) {
    if (type1 == 'icon-hover' || type1 == 'menu-hover') {
      this.menuItems?.forEach((a: any) => {
        if (this.menuItems) {
          a.active = false;
        }
        a?.children?.forEach((b: any) => {
          if (a.children) {
            b.active = false;
          }
        });
      });
    }
  }
  
  SideMenus(dataToggleClass: string, datatVerticalStyles: string) {
    this.setAttr('data-vertical-style',datatVerticalStyles);
    this.removeAttr('data-nav-style');
    if (datatVerticalStyles == 'doublemenu' && !document.querySelector('.double-menu-active')) {
        this.setAttr('data-toggled','double-menu-close');
    } else {
      this.setAttr('data-toggled', dataToggleClass);
    }
    localStorage.setItem('ynexverticalstyles', datatVerticalStyles);
    localStorage.setItem('ynexverticalstyles-toggled', dataToggleClass);
  }

  setAttr(key:string, value:string):void{
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, key, value);
    return;
  }
  
  removeAttr(key:string):void{
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.removeAttribute(htmlElement, key);
    return;
  }
  //Page Styles:
  PageChange(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-page-style', type);
    localStorage.setItem('ynex-page-mode', type);
  }

  //Layout Width Styles:
  WidthChange(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-width', type);
    localStorage.setItem('ynex-width-mode', type);

    if (document.querySelector('#slide-right')?.classList.contains('d-none')) {
      document.querySelector('#slide-right')?.classList.remove('d-none');
    }
  }

  //Menu Positions:
  MenuChange(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-menu-position', type);
    localStorage.setItem('ynex-menu-position', type);
  }

  //Header Positions:
  HeaderChange(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-header-position', type);
    localStorage.setItem('ynex-header-position', type);
  }

  //Menu Colors:
  menuTheme(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-menu-styles', type);
    localStorage.setItem('ynexMenu', type);
  }

  ngOnDestroy(): void {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    if (localStorage.getItem('ynexMenu') == 'light') {
      this.renderer.setAttribute(htmlElement, 'data-theme-mode', 'dark');
    } else {
      this.renderer.removeAttribute(htmlElement, 'data-theme-mode');
    }
    this.renderer.setAttribute(htmlElement, 'data-theme-mode', 'light');

    if (localStorage.getItem('ynexnavstyles') == 'icon-hover') {
      document
        .querySelector('.slide-menu')
        ?.setAttribute('style', 'display:none;');
    } else {
      document
        .querySelector('.slide-menu')
        ?.setAttribute('style', 'display:block;');
    }
  }

  //header theme
  headerTheme(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-header-styles', type);
    localStorage.setItem('ynexHeader', type);
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

  //light Primary theme change
  public color1: string = '#0162e8';
  public dynamicLightPrimary(data: any): void {
    this.color1 = data.color;
    const dynamicPrimaryLight = document.querySelectorAll('button.pcr-button');
    switcher.dynamicLightPrimaryColor(dynamicPrimaryLight, this.color1);
    localStorage.setItem('ynexlight-primary-color', this.color1);
    localStorage.setItem('ynexlight-primary-hover', this.color1);
    localStorage.setItem('ynexlight-primary-border', this.color1);
    let light = document.getElementById('myonoffswitch1') as HTMLInputElement;
    if (light) {
      light.checked = true;
    }
    // Adding
    localStorage.setItem('ynexLightTheme', 'true');
    // removing
    localStorage.removeItem('ynexDarkTheme');
    localStorage.removeItem('ynexTransparentTheme');
    this.body?.classList.remove('dark-theme');
    this.body?.classList.remove('transparent-theme');
    this.body?.classList.remove('bg-img1');
    this.body?.classList.remove('bg-img2');
    this.body?.classList.remove('bg-img3');
    this.body?.classList.remove('bg-img4');
    localStorage.removeItem('ynexdark-primary-color');
    localStorage.removeItem('ynextransparent-primary-color');
    localStorage.removeItem('ynextransparent-bg-color');
    localStorage.removeItem('ynextransparent-bgImg-primary-color');
    localStorage.removeItem('ynexBgImage');
  }

  //Theme Background:

  background(
    bodyBg: string,
    darkBg: string,
    darkBg1: string,
    event: string,
    type1: string
  ) {
    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty(
      '--body-bg-rgb',
      bodyBg
    );
    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty(
      '--body-bg-rgb2',
      darkBg
    );
    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty(
      '--light-rgb',
      darkBg
    );
    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty(
      '--input-border',
      darkBg1
    );
    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty(
      '--form-control-bg',
      darkBg
    );
    
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-header-styles', 'dark');
    this.renderer.setAttribute(htmlElement, 'data-menu-styles', 'dark');
    this.renderer.setAttribute(htmlElement, 'data-header-styles', type1);
    localStorage.setItem('ynexHeader', type1);
    this.renderer.setAttribute(htmlElement, 'data-menu-styles', type1);
    localStorage.setItem('ynexMenu', type1);
    this.renderer.setAttribute(htmlElement, 'data-theme-mode', type1);
    localStorage.setItem('ynexdarktheme', type1);
    localStorage.setItem('bodyBgRGB', bodyBg);
    localStorage.setItem('bodylightRGB', darkBg);

    this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute(
      'class',
      event
    );

    this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute(
      'data-theme-mode',
      type1
    );
  }

  //background theme change
  public color4 = '#6c5ffc';
  public dynamicTranparentBgPrimary(data: any): void {
    this.color4 = data.color;
    const dynamicPrimaryBgTrasnsparent =
      document.querySelectorAll('button.pcr-button');
    switcher.dynamicBgTrasnsparentPrimaryColor(
      dynamicPrimaryBgTrasnsparent,
      this.color4
    );

    // Adding
    localStorage.setItem('bodylightRGB', switcher.hexToRgba(this.color4) || '');
    localStorage.setItem('bodyBgRGB', switcher.hexToRgba2(this.color4) || '');
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-header-styles', 'dark');
    localStorage.setItem('ynexHeader', 'dark');
    this.renderer.setAttribute(htmlElement, 'data-menu-styles', 'dark');
    localStorage.setItem('ynexMenu', 'dark');
    this.renderer.setAttribute(htmlElement, 'data-theme-mode', 'dark');
    localStorage.setItem('ynexdarktheme', 'dark');
    // Removing
    const html: any = this.elementRef.nativeElement.ownerDocument.documentElement;
    html.setAttribute('data-menu-styles', 'dark');
    html.setAttribute('data-theme-mode', 'dark');
    html.setAttribute('data-header-styles', 'dark');

    if (localStorage.getItem('ynex-theme-mode') == 'dark') {
      localStorage.setItem('data-theme-mode', 'dark');
    }
  }
  //Menu With Background Image:
  ImageTheme(type: string) {
    this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute(
      'data-bg-img',
      type
    );
    localStorage.setItem('bgimg', type); 
  }

  //reset switcher
  reset() {
    localStorage.clear();
    const html: any =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    const body: any = document.querySelector('body');
    html.style = '';
    html.setAttribute('dir', 'ltr');
    html.setAttribute('data-nav-layout', 'vertical');
    html.removeAttribute('data-page-style', 'regular');
    html.removeAttribute('data-width', 'full-width');
    html.removeAttribute('data-menu-position', 'fixed');
    html.removeAttribute('data-header-position', 'fixed');
    html.setAttribute('data-header-styles', 'light');
    html.removeAttribute('data-bg-img', 'light');
    html.setAttribute('data-theme-mode', 'light');
    body.removeAttribute('class');
    html.removeAttribute('data-nav-style');
    html.removeAttribute('data-toggled');
    html.setAttribute('data-vertical-style', 'overlay');
    this.renderer.setAttribute(html, 'data-header-styles', 'light');
    localStorage.setItem('ynexHeader', 'light');
    this.renderer.setAttribute(html, 'data-menu-styles', 'dark');
    localStorage.setItem('ynexMenu', 'dark');
    document
      .querySelector('#style')
      ?.setAttribute('href', 'src/assets/scss/bootstrap.scss');
    sidebarFn.checkHoriMenu();
    //new29.12
    setPrimaryColorChecked('');
    setPrimaryColorChecked('1');
    setPrimaryColorChecked('2');
    setPrimaryColorChecked('3');
    setPrimaryColorChecked('4');

    function setPrimaryColorChecked(suffix: string): void {
      const primaryColorClick = document.getElementById(
        `switcher-primary${suffix}`
      ) as HTMLInputElement;
      if (primaryColorClick) {
        primaryColorClick.checked = false;
      }
    }

    const menuclickclosed = document.getElementById(
      'switcher-menu-click'
    ) as HTMLInputElement;
    if (menuclickclosed) {
      menuclickclosed.checked = false;
    }
    const lightclickchecked = document.getElementById(
      'switcher-light-theme'
    ) as HTMLInputElement;
    if (lightclickchecked) {
      lightclickchecked.checked = true;
    }

    const ltrclickchecked = document.getElementById(
      'myonoffswitch54'
    ) as HTMLInputElement;
    if (ltrclickchecked) {
      ltrclickchecked.checked = true;
    }

    const verticalclickchecked = document.getElementById(
      'switcher-vertical'
    ) as HTMLInputElement;
    if (verticalclickchecked) {
      verticalclickchecked.checked = true;
    }
    const defaultclickchecked = document.getElementById(
      'switcher-default-menu'
    ) as HTMLInputElement;
    if (defaultclickchecked) {
      defaultclickchecked.checked = true;
    }
  }

  public localdata = localStorage;

  SwitcherClose() {
    this.renderer.removeClass(this.switcher.nativeElement, 'show');
  }
}
