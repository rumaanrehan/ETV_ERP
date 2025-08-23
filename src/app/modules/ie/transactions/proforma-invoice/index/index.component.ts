import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;

  constructor(
    private pageHeaderService: PageHeaderService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['ie/proforma-invoice/create']);
  }


}
