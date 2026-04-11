import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, effect } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { Subject, Subscription, filter, fromEvent, takeUntil } from 'rxjs';
import { BreadcrumbTrail, Menu } from '../../../core/models/menu';
import { MenuService } from '../../../core/services/menu.service';
import { RequestContextService } from '../../../core/services/request-context.service';
import { UserService } from '../../../core/services/user.service';
import { UserStateService } from '../../../core/services/user-state.service';
import { PageHeaderService } from '../../services/page-header.service';
import { AlertNotificationService } from '../../services/alert-notification.service';
import { checkHoriMenu } from './app-sidebar';

@Component({
  selector: 'app-app-sidebar',
  standalone: true,
  imports: [SidebarModule, CommonModule, RouterModule],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.scss',
})
export class AppSidebarComponent {
  private destroy$ = new Subject<void>();
  private readonly sidebarStateStoragePrefix = 'app_sidebar_open_state_';
  public localdata = localStorage;
  public windowSubscribe$!: Subscription;
  options = { autoHide: false, scrollbarMinSize: 100 };

  isProfileActionsOpen = false;

  currentPath: string = '';
  currentModuleCode: string = '';
  hasParent = false;
  hasParentLevel = 0;

  // user!: User | null;

  // Addding sticky-pin
  scrolled = false;
  isDarkMode = localStorage.getItem('ynexdarktheme') === 'dark';

  get menuItems() {
    return this.menuService.menu();
  }

  get user() {
    return this.userStateService.user;
  }

  constructor(
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
    private userService: UserService,
    private userStateService: UserStateService,
    private requestContextService: RequestContextService,
    private menuService: MenuService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public elementRef: ElementRef,
    public renderer: Renderer2,
  ) {
    effect(() => {
      const menuData = this.menuItems; // 👈 This accesses the signal, making it reactive!

      if (menuData?.length) {
        this.applySavedSidebarState(menuData);
        this.setNavActive(null, this.currentPath);
      }
    });
  }

  ngOnInit() {
    let bodyElement: any = document.querySelector('.main-content');

    bodyElement.onclick = () => {
      if (
        localStorage.getItem('ynexnavstyles') == 'icon-click' ||
        localStorage.getItem('ynexnavstyles') == 'menu-click' ||
        localStorage.getItem('ynexnavstyles') == 'icon-hover' ||
        localStorage.getItem('ynexlayout') == 'horizontal'
      ) {
        document
          .querySelectorAll('.main-menu .slide-menu.child1')
          .forEach((ele: any) => {
            ele.style.display = 'none';
          });
      }

      if (localStorage.getItem('ynexverticalstyles') == 'icontext') {
        document.querySelector('html')?.removeAttribute('data-icon-text')
      }
    };

    // this.user = this.userStateService.getUser();

    // Handle first load manually
    this.handleNavigation(this.router.url);
    this.menuService.breadcrumbs.set(this.createBreadcrumbs(this.activatedRoute.root));

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
      // filter((event: NavigationEnd) => !event.urlAfterRedirects.startsWith('/login'))
    ).subscribe(() => {
      this.handleNavigation(this.router.url);
      this.pageHeaderService.setTemplate(null);
      this.menuService.breadcrumbs.set(this.createBreadcrumbs(this.activatedRoute.root));
    });

    const WindowResize = fromEvent(window, 'resize');
    // subscribing the Observable
    if (WindowResize) {
      this.windowSubscribe$ = WindowResize.subscribe(() => {
        // to check and adjst the menu on screen size change
        checkHoriMenu();
      });
    }

    if (document.querySelector('html')?.getAttribute('data-nav-layout') == 'horizontal' && window.innerWidth >= 992) { this.clearNavDropdown(); }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    checkHoriMenu();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // this.menuitemsSubscribe$.unsubscribe();
    this.windowSubscribe$.unsubscribe();
    document.querySelector('html')?.setAttribute('data-vertical-style', 'overlay');
    document.querySelector('html')?.setAttribute('data-nav-layout', 'vertical');
  }

  handleNavigation(url: string) {

    const urlSegments = url.split('/');
    if (urlSegments.length > 1) {
      const currentModule = urlSegments[1];

      this.currentModuleCode = currentModule ?? '';

      this.menuService.moduleCode.set(currentModule);
      this.menuService.loadMenu(currentModule);
      // if (
      //   this.menuService.moduleList.includes(currentModule) &&
      //   this.menuService.moduleCode() !== currentModule
      // ) { // Load menu only if moduleCode changes
      //   this.menuService.moduleCode.set(currentModule);
      //   this.menuService.loadMenu(currentModule);
      // }
    }

    this.currentPath = url;
    this.setNavActive(null, url);
  }

  toggleProfileActions() {
    this.isProfileActionsOpen = !this.isProfileActionsOpen;
  }

  togglesidebar() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;

    if (window.innerWidth < 768) {
      html?.setAttribute('data-toggled', html?.getAttribute('data-toggled') === 'open' ? 'close' : 'open');
      return;
    }

    if (localStorage.getItem('data-toggled') == 'true') {
      document.querySelector('html')?.getAttribute('data-toggled') == 'icon-overlay-close';
    } else if (html?.getAttribute('data-vertical-style') == 'overlay') {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document.querySelector('html')?.setAttribute('data-toggled', 'icon-overlay-close');
    } else if (localStorage.getItem('ynexverticalstyles') == 'closed') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close-menu-close' ? '' : 'close-menu-close'
      );
    } else if (localStorage.getItem('ynexverticalstyles') == 'icontext') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-text-close' ? '' : 'icon-text-close'
      );
    } else if (localStorage.getItem('ynexverticalstyles') == 'detached') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'detached-close' ? '' : 'detached-close'
      );
    } else if (localStorage.getItem('ynexverticalstyles') == 'doublemenu') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'double-menu-close' &&
          document.querySelector('.slide.open')?.classList.contains('has-sub')
          ? 'double-menu-open'
          : 'double-menu-close'
      );
    } else if (localStorage.getItem('ynexnavstyles') == 'menu-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-click-closed' ? '' : 'menu-click-closed'
      );
    } else if (localStorage.getItem('ynexnavstyles') == 'menu-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-hover-closed' ? '' : 'menu-hover-closed'
      );
    } else if (localStorage.getItem('ynexnavstyles') == 'icon-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-click-closed' ? '' : 'icon-click-closed'
      );
    } else if (localStorage.getItem('ynexnavstyles') == 'icon-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-hover-closed' ? '' : 'icon-hover-closed'
      );
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const mode = this.isDarkMode ? 'dark' : 'light';
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-theme-mode', mode);
    this.renderer.setAttribute(htmlElement, 'data-header-styles', mode);
    this.renderer.setAttribute(htmlElement, 'data-menu-styles', mode);
    localStorage.setItem('ynexdarktheme', mode);
    localStorage.setItem('ynexHeader', mode);
    localStorage.setItem('ynexMenu', mode);
  }

  themeChange(type: string, type1: string) {
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-header-styles', type);
    localStorage.setItem('ynexHeader', type);
    this.renderer.setAttribute(htmlElement, 'data-menu-styles', type1);
    localStorage.setItem('ynexMenu', type1);
    this.renderer.setAttribute(htmlElement, 'data-theme-mode', type1);
    localStorage.setItem('ynexdarktheme', type1);

    if (localStorage.getItem('ynexHeader') == 'light') {
      this.elementRef.nativeElement.ownerDocument.documentElement?.removeAttribute('style');
    }

    if (localStorage.getItem('ynexdarktheme') == 'light') {
      this.elementRef.nativeElement.ownerDocument.documentElement?.removeAttribute('style');
      localStorage.removeItem('bodyBgRGB');
      localStorage.removeItem('bodylightRGB');
    }
  }

  logout() {
    try {
      this.alertService.showConfirmation({
        text: `Do you really want to Logout?`,
      }).then(result => {
        if (result.isConfirmed) {
          this.userService.Logout()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.userStateService.clearUser();
                  this.requestContextService.ClearTokens();
                  this.router.navigate(['/login']);
                }
                else {
                  this.alertService.showServerResponseAlert(response);
                }
              },
            });
        }
      });
    }
    catch (error) {

    }
  }

  private createBreadcrumbs(route: ActivatedRoute, path: string = '', breadcrumbs: BreadcrumbTrail[] = []): BreadcrumbTrail[] {
    if (route.routeConfig?.data?.['breadcrumb']) {
      // Get breadcrumb label
      const label = route.routeConfig.data['breadcrumb'];

      // Get optional custom path (if provided)
      const customPath = route.routeConfig.data['breadcrumbPath'];
      const fullPath = customPath ? customPath : `${path}/${route.routeConfig.path}`.replace('//', '/');

      breadcrumbs.push({ label, url: customPath ? customPath : undefined });
    }

    for (const child of route.children) {
      return this.createBreadcrumbs(child, path, breadcrumbs);
    }

    return breadcrumbs;
  }

  clearNavDropdown() {
    this.menuItems?.forEach((a: any) => {
      a.active = false;
      a?.children?.forEach((b: any) => {
        b.active = false;
        b?.children?.forEach((c: any) => {
          c.active = false;
        });
      });
    });
  }

  // Start of Set menu Active event
  onMenuLinkClick(event: MouseEvent, currentPath: string) {
    this.setNavActive(event, currentPath);

    if (window.innerWidth <= 768) {
      const html = this.elementRef.nativeElement.ownerDocument.documentElement;
      html?.setAttribute('data-toggled', 'close');
    }
  }

  setNavActive(event: any, currentPath: string, menuData = this.menuItems) {
    if (event && event?.ctrlKey) {
      return;
    }

    const html = document.documentElement;

    if (html.getAttribute('data-nav-style') != "icon-hover" && html.getAttribute('data-nav-style') != "menu-hover") {
      this.markSelectedPath(menuData, currentPath);
    }
  }

  getParentObject(obj: any, childObject: Menu): Menu | null {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && JSON.stringify(obj[key]) === JSON.stringify(childObject)) {
          return obj; // Return the parent object
        }
        if (typeof obj[key] === 'object') {
          const parentObject: any = this.getParentObject(obj[key], childObject);
          if (parentObject !== null) {
            return parentObject;
          }
        }
      }
    }
    return null; // Object not found
  }

  setMenuAncestorsActive(targetObject: Menu) {
    const parent = this.getParentObject(this.menuItems, targetObject);
    let html = document.documentElement;
    if (parent) {
      if (this.hasParentLevel > 2) {
        this.hasParent = true;
      }
      parent.Active = true;
      parent.Selected = true;
      this.hasParentLevel += 1;
      this.setMenuAncestorsActive(parent);
    }
    else if (!this.hasParent) {
      if (html.getAttribute('data-vertical-style') == 'doublemenu') {
        html.setAttribute('data-toggled', 'double-menu-close');
      }
    }
  }

  removeActiveOtherMenus(item: any) {
    if (item) {
      if (Array.isArray(item)) {
        for (const val of item) {
          val.Active = false;
          val.Selected = false;
        }
      }
      item.Active = false;
      item.Selected = false;

      if (item.Children && item.Children.length > 0) {
        this.removeActiveOtherMenus(item.Children);
      }
    }
    else {
      return;
    }
  }

  // Start of Toggle menu event
  toggleNavActive(event: any, targetObject: Menu, menuData = this.menuItems) {
    let html = document.documentElement;
    let element = event.target;
    if (html.getAttribute('data-nav-style') != "icon-hover" && html.getAttribute('data-nav-style') != "menu-hover") {
      for (const item of menuData) {
        if (item === targetObject) {
          if (html.getAttribute('data-vertical-style') == 'doublemenu' && item.Active) { return }
          item.Active = !item.Active;
          if (item.Active) {
            this.closeOtherMenus(menuData, item);
          } else {
            if (html.getAttribute('data-vertical-style') == 'doublemenu') {
              html.setAttribute('data-toggled', 'double-menu-close');
            }
          }
          this.setAncestorsActive(menuData, item);
          this.saveSidebarState(this.menuItems);

        } else if (!item.Active) {
          if (html.getAttribute('data-vertical-style') != 'doublemenu') {
            item.Active = false; // Set active to false for items not matching the target
          }
        }
        if (item.Children && item.Children.length > 0) {
          this.toggleNavActive(event, targetObject, item.Children);
        }
      }
      if (targetObject?.Children && targetObject.Active) {
        if (html.getAttribute('data-vertical-style') == 'doublemenu' && html.getAttribute('data-toggled') != 'double-menu-open') {
          html.setAttribute('data-toggled', 'double-menu-open');
        }
      }

      if (element && html.getAttribute("data-nav-layout") == 'horizontal' && (html.getAttribute("data-nav-style") == 'menu-click' || html.getAttribute("data-nav-style") == 'icon-click')) {
        const listItem = element.closest("li");
        if (listItem) {
          // Find the first sibling <ul> element
          const siblingUL = listItem.querySelector("ul");
          let outterUlWidth = 0;
          let listItemUL = listItem.closest('ul:not(.main-menu)');
          while (listItemUL) {
            listItemUL = listItemUL.parentElement.closest('ul:not(.main-menu)');
            if (listItemUL) {
              outterUlWidth += listItemUL.clientWidth;
            }
          }
          setTimeout(() => {
            let computedValue = siblingUL.getBoundingClientRect();
            if ((computedValue.bottom) > window.innerHeight) {
              siblingUL.style.height = (window.innerHeight - computedValue.top - 8) + 'px !important';
              siblingUL.style.overflow = 'auto !important';
            }
          }, 100);
        }
      }
    }
  }

  setAncestorsActive(menuData: Menu[], targetObject: Menu) {
    let html = document.documentElement;
    const parent = this.findParent(menuData, targetObject);
    if (parent) {
      parent.Active = true;
      if (parent.Active) {
        html.setAttribute('data-toggled', 'double-menu-open');
      }
      this.setAncestorsActive(menuData, parent);
    } else {
      if (html.getAttribute('data-vertical-style') == 'doublemenu') {
        html.setAttribute('data-toggled', 'double-menu-close');
      }
    }
  }

  closeOtherMenus(menuData: Menu[], targetObject: Menu) {
    for (const item of menuData) {
      if (item !== targetObject) {
        item.Active = false;
        if (item.Children && item.Children.length > 0) {
          this.closeOtherMenus(item.Children, targetObject);
        }
      }
    }
  }

  findParent(menuData: Menu[], targetObject: Menu) {
    for (const item of menuData) {
      if (item.Children && item.Children.includes(targetObject)) {
        return item;
      }
      if (item.Children && item.Children.length > 0) {
        const parent: any = this.findParent(item.Children, targetObject);
        if (parent) {
          return parent;
        }
      }
    }
    return null;
  }
  // End of Toggle menu event

  private markSelectedPath(menuData: Menu[], currentPath: string): boolean {
    let foundInTree = false;

    for (const item of menuData) {
      const selfSelected = !!item.Path && item.Path === currentPath;
      const childSelected = item.Children?.length ? this.markSelectedPath(item.Children, currentPath) : false;
      item.Selected = selfSelected || childSelected;
      foundInTree = foundInTree || item.Selected;
    }

    return foundInTree;
  }

  private getSidebarStateStorageKey(): string {
    const moduleCode = this.currentModuleCode || this.menuService.moduleCode() || 'default';
    return `${this.sidebarStateStoragePrefix}${moduleCode}`;
  }

  private buildMenuStateKey(item: Menu, parentKey: string, index: number): string {
    const title = item.Title ?? '';
    const path = item.Path ?? '';
    const type = item.MenuType ?? '';
    const token = `${index}:${title}|${path}|${type}`;
    return parentKey ? `${parentKey}>${token}` : token;
  }

  private collectSidebarState(menuData: Menu[], state: Record<string, boolean>, parentKey = ''): void {
    menuData.forEach((item, index) => {
      const nodeKey = this.buildMenuStateKey(item, parentKey, index);
      if (item.MenuType === 'sub' || (item.Children?.length ?? 0) > 0) {
        state[nodeKey] = !!item.Active;
      }
      if (item.Children?.length) {
        this.collectSidebarState(item.Children, state, nodeKey);
      }
    });
  }

  private applySidebarState(menuData: Menu[], state: Record<string, boolean>, parentKey = ''): void {
    menuData.forEach((item, index) => {
      const nodeKey = this.buildMenuStateKey(item, parentKey, index);
      if (item.MenuType === 'sub' || (item.Children?.length ?? 0) > 0) {
        item.Active = state[nodeKey] ?? false;
      }
      if (item.Children?.length) {
        this.applySidebarState(item.Children, state, nodeKey);
      }
    });
  }

  private saveSidebarState(menuData: Menu[]): void {
    const state: Record<string, boolean> = {};
    this.collectSidebarState(menuData, state);
    localStorage.setItem(this.getSidebarStateStorageKey(), JSON.stringify(state));
  }

  private applySavedSidebarState(menuData: Menu[]): void {
    const rawState = localStorage.getItem(this.getSidebarStateStorageKey());
    if (!rawState) {
      this.applySidebarState(menuData, {});
      return;
    }

    try {
      const parsed = JSON.parse(rawState) as Record<string, boolean>;
      this.applySidebarState(menuData, parsed ?? {});
    } catch {
      this.applySidebarState(menuData, {});
    }
  }

  HoverToggleInnerMenuFn(event: Event, item: Menu) {
    let html = document.documentElement;
    let element = event.target as HTMLElement;
    if (element && html.getAttribute("data-nav-layout") == 'horizontal' && (html.getAttribute("data-nav-style") == 'menu-hover' || html.getAttribute("data-nav-style") == 'icon-hover')) {
      const listItem = element.closest("li");
      if (listItem) {
        // Find the first sibling <ul> element
        const siblingUL = listItem.querySelector("ul");
        let outterUlWidth = 0;
        let listItemUL: any = listItem.closest('ul:not(.main-menu)');
        while (listItemUL) {
          listItemUL = listItemUL.parentElement?.closest('ul:not(.main-menu)');
          if (listItemUL) {
            outterUlWidth += listItemUL.clientWidth;
          }
        }
      }
    }
  }

  getMenuIcons(menuTitle: string | undefined) {
    return menuTitle === 'Setup' ? 'bxs-cog' : menuTitle === 'Transactions' ? 'bx-file-blank' : menuTitle === 'Reports' ? 'bxs-report' : menuTitle === 'Settings' ? 'bx-cog' : 'bx-home';
  }

  leftArrowFn() {
    // Used to move the slide of the menu in Horizontal and also remove the arrows after click  if there was no space 
    // Used to Slide the menu to Left side
    let slideLeft = document.querySelector('.slide-left') as HTMLElement;
    let slideRight = document.querySelector('.slide-right') as HTMLElement;
    let menuNav = document.querySelector('.main-menu') as HTMLElement;
    let mainContainer1 = document.querySelector('.main-sidebar') as HTMLElement;
    let marginRightValue = Math.ceil(Number(window.getComputedStyle(menuNav).marginInlineStart.split('px')[0]));
    let mainContainer1Width = mainContainer1.offsetWidth;
    if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
      if (marginRightValue < 0 && !(Math.abs(marginRightValue) < mainContainer1Width)) {
        menuNav.style.marginInlineStart = Number(menuNav.style.marginInlineStart.split('px')[0]) + Math.abs(mainContainer1Width) + 'px';
        slideRight.classList.remove('d-none');
      } else if (marginRightValue >= 0) {
        menuNav.style.marginInlineStart = '0px';
        slideLeft.classList.add('d-none');
        slideRight.classList.remove('d-none');
      } else {
        menuNav.style.marginInlineStart = '0px';
        slideLeft.classList.add('d-none');
        slideRight.classList.remove('d-none');
      }
    }
    else {
      menuNav.style.marginInlineStart = "0px";
      slideLeft.classList.add('d-none');
    }

    let element = document.querySelector(".main-menu > .slide.open") as HTMLElement;
    let element1 = document.querySelector(".main-menu > .slide.open >ul") as HTMLElement;
    if (element) {
      element.classList.remove("open")
    }
    if (element1) {
      element1.style.display = "none"
    }
  }

  rightArrowFn() {
    // Used to move the slide of the menu in Horizontal and also remove the arrows after click  if there was no space 
    // Used to Slide the menu to Right side
    let slideLeft = document.querySelector('.slide-left') as HTMLElement;
    let slideRight = document.querySelector('.slide-right') as HTMLElement;
    let menuNav = document.querySelector('.main-menu') as HTMLElement;
    let mainContainer1 = document.querySelector('.main-sidebar') as HTMLElement;
    let marginRightValue = Math.ceil(Number(window.getComputedStyle(menuNav).marginInlineStart.split('px')[0]));
    let check = menuNav.scrollWidth - mainContainer1.offsetWidth;
    let mainContainer1Width = mainContainer1.offsetWidth;
    if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
      if (Math.abs(check) > Math.abs(marginRightValue)) {
        if (!(Math.abs(check) > Math.abs(marginRightValue) + mainContainer1Width)) {
          mainContainer1Width = Math.abs(check) - Math.abs(marginRightValue);
          slideRight.classList.add('d-none');
        }
        menuNav.style.marginInlineStart = Number(menuNav.style.marginInlineStart.split('px')[0]) - Math.abs(mainContainer1Width) + 'px';
        slideLeft.classList.remove('d-none');
      }
    }

    let element = document.querySelector(".main-menu > .slide.open") as HTMLElement
    let element1 = document.querySelector(".main-menu > .slide.open >ul") as HTMLElement
    if (element) {
      element.classList.remove("open")
    }
    if (element1) {
      element1.style.display = "none"
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 10;

    const sections = document.querySelectorAll('.side-menu__item');
    const scrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    sections.forEach((ele, i) => {
      const currLink = sections[i];
      const val: any = currLink.getAttribute('value');
      const refElement: any = document.querySelector('#' + val);

      // Add a null check here before accessing properties of refElement
      if (refElement !== null) {
        const scrollTopMinus = scrollPos + 73;
        if (
          refElement.offsetTop <= scrollTopMinus &&
          refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
        ) {
          document.querySelector('.nav-scroll')?.classList.remove('active');
          currLink.classList.add('active');
        } else {
          currLink.classList.remove('active');
        }
      }
    }
    );
  }
}
