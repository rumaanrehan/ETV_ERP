import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { Subscription, fromEvent } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { checkHoriMenu } from './sidebar';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public localdata = localStorage;
  public windowSubscribe$!: Subscription;
  options = { autoHide: false, scrollbarMinSize: 100 };
  public menuItems!: Menu[];
  public menuitemsSubscribe$!: Subscription;
  constructor(
    private navServices: NavService,
    public router: Router,
    public renderer: Renderer2
  ) {
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
    this.menuitemsSubscribe$ = this.navServices.items.subscribe((items) => {
      this.menuItems = items;
    });

    this.setNavActive(null, this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setNavActive(null, this.router.url);
      }
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
  // Start of Set menu Active event
  setNavActive(event:any, currentPath: string, menuData = this.menuItems) {
    if(event){
      if (event?.ctrlKey) {
        return;
      }
    }
    let html = document.documentElement;
    if (html.getAttribute('data-nav-style') != "icon-hover" && html.getAttribute('data-nav-style') != "menu-hover") {
      // if (!event?.ctrlKey) {
      for (const item of menuData) {
        if (item.path === currentPath) {
          item.active = true;
          item.selected = true;
          this.setMenuAncestorsActive(item);
        } else if (!item.active && !item.selected) {
          item.active = false; // Set active to false for items not matching the target
          item.selected = false; // Set active to false for items not matching the target
        } else {
          this.removeActiveOtherMenus(item);
        }
        if (item.children && item.children.length > 0) {
          this.setNavActive(event, currentPath, item.children);
        }
      }
      // }
    }
  }
  getParentObject(obj: any, childObject: Menu) {
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

  hasParent = false;
  hasParentLevel = 0;
  
  setMenuAncestorsActive(targetObject: Menu) {
    const parent = this.getParentObject(this.menuItems, targetObject);
    let html = document.documentElement;
    if (parent) {
      if (this.hasParentLevel > 2) {
        this.hasParent = true;
      }
      parent.active = true;
      parent.selected = true;
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
          val.active = false;
          val.selected = false;
        }
      }
      item.active = false;
      item.selected = false;

      if (item.children && item.children.length > 0) {
        this.removeActiveOtherMenus(item.children);
      }
    }
    else {
      return;
    }
  }
  // Toggle menu
  // toggleNavActive(event: Event, item: any) {
  //   let target = event.currentTarget as HTMLElement;

  //   let html = document.querySelector('html');
  //   //toggle double menu 
  //   if (html?.getAttribute('data-vertical-style') == 'doublemenu') {
  //     if (item.active && !target?.closest('.child1')) return;
  //     html?.setAttribute('data-toggled', 'double-menu-open')
  //   }
  //   if (html?.getAttribute('data-vertical-style') == 'icontext') {
  //     html?.setAttribute('data-icon-text', 'open');
  //   } else {
  //     html?.removeAttribute('data-icon-text');
  //   }


  //   let element = event.target as HTMLElement;
  //   if (html && html.getAttribute('data-nav-style') != "icon-hover" && html.getAttribute('data-nav-style') != "menu-hover") {
  //     if (element && html.getAttribute("data-nav-layout") == 'horizontal' && (html.getAttribute("data-nav-style") == 'menu-click' || html.getAttribute("data-nav-style") == 'icon-click')) {
  //       const listItem = element.closest("li") as HTMLElement;
  //       // Get the position of the clicked element
  //       var dropdownRect = listItem.getBoundingClientRect();
  //       var dropdownWidth = target.getBoundingClientRect().width;

  //       // Calculate the right edge position
  //       var rightEdge = dropdownRect.right + dropdownWidth;
  //       var leftEdge = dropdownRect.left - dropdownWidth;

  //       if (html.getAttribute("dir") == "rtl") {
  //         if (leftEdge < 0) {
  //           item.dirchange = true;
  //         } else {
  //           if (listItem.closest('ul')?.classList.contains('force-left') && rightEdge < window.innerWidth) {
  //             item.dirchange = true;
  //           } else {
  //             // Reset classes and position if not moving out
  //             item.dirchange = false;
  //           }
  //         }
  //       } else {
  //         // Check if moving out to the right
  //         if (rightEdge > window.innerWidth) {
  //           item.dirchange = true;
  //         } else {
  //           if (listItem.closest('ul')?.classList.contains('force-left') && leftEdge > 0) {
  //             item.dirchange = true;
  //           }
  //           // Check if moving out to the left
  //           else if (leftEdge < 0) {
  //             item.dirchange = false;
  //           } else {
  //             // Reset classes and position if not moving out
  //             item.dirchange = false;
  //           }
  //         }
  //       }
  //     }
  //   }


  //   if (!item.active) {
  //     this.menuItems?.forEach((a: any) => {
  //       if (this.menuItems.includes(item)) {
  //         a.active = false;
  //       }
  //       a?.children?.forEach((b: any) => {
  //         if (a.children.includes(item)) {
  //           b.active = false;
  //         }
  //         b?.children?.forEach((c: any) => {
  //           if (b.children.includes(item)) {
  //             c.active = false;
  //           }
  //         });
  //       });
  //     });
  //   }
  //   item.active = !item.active;

  // }
   // Start of Toggle menu event
   toggleNavActive(event:any, targetObject:Menu, menuData = this.menuItems) {
    let html = document.documentElement;
    let element = event.target;
    if (html.getAttribute('data-nav-style') != "icon-hover" && html.getAttribute('data-nav-style') != "menu-hover") {
        for (const item of menuData) {
            if (item === targetObject) {
                if (html.getAttribute('data-vertical-style') == 'doublemenu' && item.active) { return }
                item.active = !item.active;
                if (item.active) {
                    this.closeOtherMenus(menuData, item);
                } else {
                    if (html.getAttribute('data-vertical-style') == 'doublemenu') {
                        html.setAttribute('data-toggled', 'double-menu-close');
                    }
                }
                this.setAncestorsActive(menuData, item);

            } else if (!item.active) {
                if (html.getAttribute('data-vertical-style') != 'doublemenu') {
                    item.active = false; // Set active to false for items not matching the target
                }
            }
            if (item.children && item.children.length > 0) {
                this.toggleNavActive(event, targetObject, item.children);
            }
        }
        if (targetObject?.children && targetObject.active) {
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
                if (siblingUL) {
                    // You've found the sibling <ul> element
                    let siblingULRect = listItem.getBoundingClientRect();
                    if (html.getAttribute('dir') == 'rtl') {
                        if ((siblingULRect.left - siblingULRect.width - outterUlWidth + 150 < 0 && outterUlWidth < window.innerWidth) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
                            targetObject.dirchange = true;
                        } else {
                            targetObject.dirchange = false;
                        }
                    } else {
                        if ((outterUlWidth + siblingULRect.right + siblingULRect.width + 50 > window.innerWidth && siblingULRect.right >= 0) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
                            targetObject.dirchange = true;
                        } else {
                            targetObject.dirchange = false;
                        }
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
setAncestorsActive(menuData:Menu[], targetObject:Menu) {
    let html = document.documentElement;
    const parent = this.findParent(menuData, targetObject);
    if (parent) {
        parent.active = true;
        if (parent.active) {
            html.setAttribute('data-toggled', 'double-menu-open');
        }
        this.setAncestorsActive(menuData, parent);
    } else {
        if (html.getAttribute('data-vertical-style') == 'doublemenu') {
            html.setAttribute('data-toggled', 'double-menu-close');
        }
    }
}
closeOtherMenus(menuData:Menu[], targetObject:Menu) {
    for (const item of menuData) {
        if (item !== targetObject) {
            item.active = false;
            if (item.children && item.children.length > 0) {
                this.closeOtherMenus(item.children, targetObject);
            }
        }
    }
}
findParent(menuData:Menu[], targetObject:Menu) {
    for (const item of menuData) {
        if (item.children && item.children.includes(targetObject)) {
            return item;
        }
        if (item.children && item.children.length > 0) {
            const parent:any = this.findParent(item.children, targetObject);
            if (parent) {
                return parent;
            }
        }
    }
    return null;
}
// End of Toggle menu event
HoverToggleInnerMenuFn(event:Event, item:Menu) {
    let html = document.documentElement;
    let element = event.target as HTMLElement;
    if (element && html.getAttribute("data-nav-layout") == 'horizontal' && (html.getAttribute("data-nav-style") == 'menu-hover' || html.getAttribute("data-nav-style") == 'icon-hover')) {
        const listItem = element.closest("li");
        if (listItem) {
            // Find the first sibling <ul> element
            const siblingUL = listItem.querySelector("ul");
            let outterUlWidth = 0;
            let listItemUL:any = listItem.closest('ul:not(.main-menu)');
            while (listItemUL) {
                listItemUL = listItemUL.parentElement?.closest('ul:not(.main-menu)');
                if (listItemUL) {
                    outterUlWidth += listItemUL.clientWidth;
                }
            }
            if (siblingUL) {
                // You've found the sibling <ul> element
                let siblingULRect = listItem.getBoundingClientRect();
                if (html.getAttribute('dir') == 'rtl') {
                    if ((siblingULRect.left - siblingULRect.width - outterUlWidth + 150 < 0 && outterUlWidth < window.innerWidth) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
                        item.dirchange = true;
                    } else {
                        item.dirchange = false;
                    }
                } else {
                    if ((outterUlWidth + siblingULRect.right + siblingULRect.width + 50 > window.innerWidth && siblingULRect.right >= 0) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
                        item.dirchange = true;
                    } else {
                        item.dirchange = false;
                    }
                }
            }
        }
    }
}

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    checkHoriMenu();

  }
  ngOnDestroy() {
    this.menuitemsSubscribe$.unsubscribe();
    this.windowSubscribe$.unsubscribe();
    document.querySelector('html')?.setAttribute('data-vertical-style', 'overlay');
    document.querySelector('html')?.setAttribute('data-nav-layout', 'vertical');
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

  // Addding sticky-pin
  scrolled = false;

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
    });
  }
}
