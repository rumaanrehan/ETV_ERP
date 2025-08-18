import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwitcherService } from '../../../shared/services/switcher.service';
import { Menu, NavService } from '../../services/nav.service';
import { UserService } from '../../../core/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { UserStateService } from '../../../core/services/user-state.service';
import { RequestContextService } from '../../../core/services/request-context.service';
import { Router } from '@angular/router';
import { AlertNotificationService } from '../../services/alert-notification.service';

interface Item {
  id: number;
  name: string;
  type: string;
  title: string;
  // Add other properties as needed
}
@Component({
  selector: 'app-header',
  //imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('dropdown') dropdown!: ElementRef<HTMLSelectElement>;

  cartItemCount: number = 5;
  notificationCount: number = 5;
  //ahc: string = autoClose;
  constructor(
    public elementRef: ElementRef,
    public SwitcherService: SwitcherService,
    private modalService: NgbModal,
    public renderer: Renderer2,
    public NavServices: NavService,
    private userService: UserService,
    private userStateService: UserStateService,
    private requestContextService: RequestContextService,
    private alertService: AlertNotificationService,
    private router: Router
  ) {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    // if(html?.getAttribute('data-toggled') == 'detached-close'){
    //   html?.setAttribute('data-toggled', 'detached-close');
    // }
  }

  ngAfterViewInit(): void {
    // Ensure the width is adjusted after the view is initialized
    this.setDropdownWidth();
  }

  onSelectionChange(): void {
    this.setDropdownWidth();
  }

  private setDropdownWidth(): void {
    if (!this.dropdown) return;

    const dropdownElement = this.dropdown.nativeElement;
    const selectedOption = dropdownElement.options[dropdownElement.selectedIndex];
    const optionText = selectedOption.text;
    const optionWidth = this.calculateTextWidth(optionText);

    // Add extra padding to the width
    const padding = 24; // Adjust this value as needed
    dropdownElement.style.width = `${Math.max(optionWidth + padding, 100)}px`; // Ensure minimum width
  }


  private calculateTextWidth(text: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = window.getComputedStyle(this.dropdown.nativeElement).font;
    return context.measureText(text).width;
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
              complete: () => {
              }
            });
        }
      });
    }
    catch (error) {

    }
  }






  toggleSwicher() {
    this.SwitcherService.emitChange(true);
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (html?.getAttribute('data-toggled') == 'open') {
      document.querySelector('#responsive-overlay')?.classList.add('active');
    } else {
      document.querySelector('#responsive-overlay')?.classList.remove('active');
    }
  }

  themeType = 'dark';
  // Theme color Mode
  themeChange(type: string, type1: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-header-styles', type);
    localStorage.setItem('ynexHeader', type);
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
      localStorage.removeItem('bodyBgRGB');
      localStorage.removeItem('bodylightRGB');
    }
  }

  toggleSidebar() {
    if (localStorage.getItem('data-toggled') == 'true') {
      document.querySelector('html')?.getAttribute('data-toggled') ==
        'icon-overlay-close';
    } else {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
          .querySelector('html')
          ?.setAttribute('data-toggled', 'icon-overlay-close');
    }
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;

    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'open' ? 'close' : 'open'
      );
      if (html?.getAttribute('data-toggled') == 'open') {
        document.querySelector('#responsive-overlay')?.classList.add('active');
      } else {
        document
          .querySelector('#responsive-overlay')
          ?.classList.remove('active');
      }
    }
  }

  togglesidebar() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (localStorage.getItem('data-toggled') == 'true') {
      document.querySelector('html')?.getAttribute('data-toggled') == 'icon-overlay-close';
    } else if (html?.getAttribute('data-vertical-style') == 'overlay') {
      document.querySelector('html')?.getAttribute('data-toggled') != null ? document.querySelector('html')?.removeAttribute('data-toggled') : document.querySelector('html')?.setAttribute('data-toggled', 'icon-overlay-close');
    } else if (localStorage.getItem('ynexverticalstyles') == 'closed') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close-menu-close'
          ? ''
          : 'close-menu-close'
      );
    } else if (localStorage.getItem('ynexverticalstyles') == 'icontext') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-text-close'
          ? ''
          : 'icon-text-close'
      );
    } else if (localStorage.getItem('ynexverticalstyles') == 'detached') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'detached-close'
          ? ''
          : 'detached-close'
      );
    } else if (localStorage.getItem('ynexverticalstyles') == 'doublemenu') {
      html?.setAttribute('data-toggled', html?.getAttribute('data-toggled') == 'double-menu-close' && document.querySelector(".slide.open")?.classList.contains("has-sub") ? 'double-menu-open' : 'double-menu-close');

    } else if (localStorage.getItem('ynexnavstyles') == 'menu-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-click-closed'
          ? ''
          : 'menu-click-closed'
      );
    } else if (localStorage.getItem('ynexnavstyles') == 'menu-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-hover-closed'
          ? ''
          : 'menu-hover-closed'
      );
    } else if (localStorage.getItem('ynexnavstyles') == 'icon-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-click-closed'
          ? ''
          : 'icon-click-closed'
      );
    } else if (localStorage.getItem('ynexnavstyles') == 'icon-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-hover-closed'
          ? ''
          : 'icon-hover-closed'
      );
    }
    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'open' ? 'close' : 'open'
      );
    }
  }


  SearchModal(SearchModal: any) {
    this.modalService.open(SearchModal);
  }

  isCartEmpty: boolean = false;
  isNotifyEmpty: boolean = false;

  removeRow(rowId: string) {
    const rowElement = document.getElementById(rowId);
    if (rowElement) {
      rowElement.remove();
    }
    this.cartItemCount--;
    this.isCartEmpty = this.cartItemCount === 0;
  }

  removeNotify(rowId: string) {
    const rowElement = document.getElementById(rowId);
    if (rowElement) {
      rowElement.remove();
    }
    this.notificationCount--;
    this.isNotifyEmpty = this.notificationCount === 0;
  }

  handleCardClick(event: MouseEvent) {
    // Prevent the click event from propagating to the container
    event.stopPropagation();
  }

  isFullscreen: boolean = false;

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  ngOnInit(): void {
    //this.NavServices.items.subscribe((menuItems) => {
    //  this.items = menuItems;
    //});
    // To clear and close the search field by clicking on body
    document.querySelector('.main-content')?.addEventListener('click', () => {
      this.clearSearch();
    })
    this.text = '';
  }

  //search 
  public menuItems!: Menu[];
  public items!: Menu[];
  public text!: string;
  public SearchResultEmpty: boolean = false;

  Search(searchText: any) {
    if (!searchText) return this.menuItems = [];
    // items array which stores the elements
    let items: any[] = [];
    // Converting the text to lower case by using toLowerCase() and trim() used to remove the spaces from starting and ending
    searchText = searchText.toLowerCase().trim();
    this.items.filter((menuItems: any) => {
      // checking whether menuItems having title property, if there was no title property it will return
      if (!menuItems?.title) return false;
      //  checking wheteher menuitems type is text or string and checking the titles of menuitems
      if (menuItems.type === 'link' && menuItems.title.toLowerCase().includes(searchText)) {
        // Converting the menuitems title to lowercase and checking whether title is starting with same text of searchText
        if (menuItems.title.toLowerCase().startsWith(searchText)) {// If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(menuItems))
          // If both are matching then the code is pushed to items array
          items.push(menuItems);
        }
      }
      //  checking whether the menuItems having children property or not if there was no children the return
      if (!menuItems.children) return false;
      menuItems.children.filter((subItems: any) => {
        if (subItems.type === 'link' && subItems.title.toLowerCase().includes(searchText)) {
          if (subItems.title.toLowerCase().startsWith(searchText)) {         // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subItems))
            items.push(subItems);
          }

        }
        if (!subItems.children) return false;
        subItems.children.filter((subSubItems: any) => {
          if (subSubItems.title.toLowerCase().includes(searchText)) {
            if (subSubItems.title.toLowerCase().startsWith(searchText)) {// If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subSubItems))
              items.push(subSubItems);
            }
          }
        })
        return;
      })
      return this.menuItems = items;
    });
    // Used to show the No search result found box if the length of the items is 0
    if (!items.length) {
      this.SearchResultEmpty = true;
    }
    else {
      this.SearchResultEmpty = false;
    }
    return;
  }

  //  Used to clear previous search result
  clearSearch() {
    this.text = '';
    this.menuItems = [];
    this.SearchResultEmpty = false;
    return this.text, this.menuItems
  }
}
