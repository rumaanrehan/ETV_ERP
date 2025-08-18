import { Component, OnInit, TemplateRef } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { PageHeaderService } from '../../services/page-header.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  pageHeaderActionTemplate!: TemplateRef<any> | null;

  get breadcrumbs() {
    return this.menuService.breadcrumbs();
  }

  routerEvents: any[] = []
  constructor(
    private pageHeaderService: PageHeaderService,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    // Subscribe to the template sent by the routed components
    this.pageHeaderService.getTemplate().subscribe((template: TemplateRef<any>) => {
      this.pageHeaderActionTemplate = template;
    });
  }
}