import { Component, OnInit, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PageHeaderService } from '../../services/page-header.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  pageHeaderActionTemplate!: TemplateRef<any>;

  routerEvents:any[]=[]
  constructor(private router: Router, private pageHeaderService: PageHeaderService) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.routerEvents = event.url.split('/').filter(e => e != '');
      }
    })
  }

  ngOnInit() {
    // Subscribe to the template sent by the routed components
    this.pageHeaderService.getTemplate().subscribe((template: TemplateRef<any>) => {
      this.pageHeaderActionTemplate = template;
    });
  }
}
