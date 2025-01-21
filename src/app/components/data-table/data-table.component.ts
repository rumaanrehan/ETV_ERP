import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { DataTableService ,DataTablesResponse } from './data-table.service';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { MydatatableDirective } from '../../shared/directives/mydatatable.directive';
//import { DataTablesSettings } from 'angular-datatables';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [DataTablesModule, MydatatableDirective],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  dtOptions: Config = {};

  constructor(private dataService: DataTableService) { }

  ngOnInit(): void {
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        this.dataService.getDataTableData(dataTablesParameters).subscribe((resp) => {
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data,
          });
        });
      },
      columns: [
        {
          title: 'Module ID',
          data: 'ModuleID',
        },
        {
          title: 'Module Code',
          data: 'ModuleCode',
        },
        {
          title: 'Module Name',
          data: 'ModuleName',
        },
        {
          title: 'Module Name',
          data: 'ModuleName',
        },
        {
          title: 'Module Name',
          data: 'ModuleName',
        },
        {
          title: 'Module Name',
          data: 'ModuleName',
        },
        {
          title: 'Module Name',
          data: 'ModuleName',
        },
        {
          title: 'Module Name',
          data: 'ModuleName',
        },
        {
          title: 'Module Name',
          data: 'ModuleName',
        },
      ],
    };
  }

  initCustomPagination() {
    const renderer = ($.fn.DataTable.ext.renderer as any); // Bypass TypeScript type checking
    debugger
    if (renderer && renderer.pagingButton) {
      console.log(renderer.pagingButton);
      renderer.pagingButton.input = function (settings: any, buttonType: any, content: any, active: any, disabled: any) {
        var classes = settings.oClasses.paging;
        var btnClasses = [classes.button];
        var btn;

        if (active) {
          btnClasses.push(classes.active);
        }

        if (disabled) {
          btnClasses.push(classes.disabled);
        }

        if (buttonType === 'ellipsis') {
          btn = $('<div>', { class: 'sp-inline' }).append($('<span>', { class: 'paginate_page' }).text('Page'))
            .append(this.createInputElement(settings)) // Assuming this function is defined elsewhere
            .append($('<span>', { class: 'paginate_of' }).text('of ' + $(settings.nTable).DataTable().page.info().pages))[0];
        } else {
          btn = $('<button>', {
            class: btnClasses.join(' '),
            role: 'link',
            type: 'button'
          }).html(content);
        }

        return {
          display: btn,
          clicker: btn
        };
      };
    } else {
      console.error('pagingButton or renderer is not defined');
    }
  }
}
