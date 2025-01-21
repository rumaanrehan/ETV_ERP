import {
    Component,
    ElementRef,
    Renderer2,
    TemplateRef,
    inject
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { SwitcherService } from '../../../shared/services/switcher.service';
import { Menu, NavService } from '../../services/nav.service';

@Component({
  selector: 'app-home-layout',
  //standalone: true,
  //imports: [RouterOutlet],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {
  

  private offcanvasService = inject(NgbOffcanvas);
  lastSegment: any;
  public menuItems!: Menu[];

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    public navServices: NavService,
    public SwitcherService: SwitcherService,
    public renderer: Renderer2
  ) {
    this.navServices.items.subscribe((menuItems: any) => {
      this.menuItems = menuItems;
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  clickOnBody() {
    document.querySelector('#cartitemclose')?.classList.remove('show'); document.querySelector('#header-cart-items-scroll')?.removeAttribute('class');
    document.querySelector('#notificationitemclose')?.classList.remove('show') || document.querySelector('#notificationitemclose')?.classList.remove('show');
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.SwitcherService.emitChange(false);

    if (localStorage.getItem('ynexverticalstyles') == 'icontext') {
      this.renderer.removeAttribute(htmlElement, 'data-icon-text');
    }

    if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal' && window.innerWidth > 992) {
      this.closeMenu();
    }

    //const switcher = this.elementRef.nativeElement.querySelector('.switcher');
    //if (switcher) {
    //  this.renderer.removeClass(switcher, 'show');
    //  document.querySelector('#responsive-overlay')?.classList.add('active');
    //} else {
    //  this.renderer.addClass('data-toggle', 'close');
    //  document.querySelector('#responsive-overlay')?.classList.remove('active');
    //}
    const sidebar = this.elementRef.nativeElement.querySelector('.sidebar');
    if (sidebar) {
      this.renderer.removeClass(sidebar, 'show');
    }

    document.querySelector('#responsive-overlay')?.classList.remove('active');
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close' ? 'close' : 'close'
      );
    }
  }

  closeMenu() {
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

  clearToggle() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    html?.setAttribute('data-toggled', 'close');
    document.querySelector('#responsive-overlay')?.classList.remove('active');
  }
}
