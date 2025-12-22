import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataViewLazyLoadEvent, DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from "primeng/selectbutton";
import { Subject, takeUntil } from 'rxjs';
import { ApiListResponse } from '../../models/api-response';
import { DataTableFilterListRequest, StaticList } from '../../models/select-list';
import { ZFormControlsModule } from '../z-form-controls/z-form-controls.module';
import { DataViewDef } from './z-dataview';
import { SelectListService } from '../../services/select-list.service';
import { ZDataviewService } from './z-dataview.service';

@Component({
  selector: 'z-dataview',
  standalone: true,
  imports: [DataViewModule, CommonModule, ReactiveFormsModule, ZFormControlsModule, SelectButtonModule],
  templateUrl: './z-dataview.component.html',
  styleUrl: './z-dataview.component.scss'
})
export class ZDataviewComponent<T> {

  private destroy$ = new Subject<void>();
  @ViewChild('dv') dataView!: DataView;
  /* Declarations */
  @Input() dataViewDef!: DataViewDef<T>;
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() sortFieldList!: any[];

  @Output() lazyLoad: EventEmitter<DataViewLazyLoadEvent> = new EventEmitter();
  @Output() resetFormEmitter = new EventEmitter<FormGroup>();

  @ViewChild('sortingPanel') sortingPanel!: ElementRef;
  @ViewChild('filterPanel') filterPanel!: ElementRef;


  tableStateKey!: string;
  tableName!: string[];
  isFilterPanelVisible: boolean = false;
  isSortPanelVisible: boolean = false;
  dataViewLazyLoadEvent!: DataViewLazyLoadEvent;

  constructor(
    private dataviewService: ZDataviewService,
    private selectListService: SelectListService
  ) { }

  ngOnInit() {
    this.tableStateKey = `ZDataTable_${this.dataViewDef.tableKey}`;
    this.tableName = this.dataViewDef.tableKey.split('_');

    this.dataViewDef.filterFields
      ?.filter(f => f.type === 'dropdown')
      .forEach(f => {
        this.loadFilterList(f.field);
      });

    this.getStatusList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAscLabel(field: string): string {
    return field.includes('Date') ? 'Oldest first' : 'A to Z';
  }

  getDescLabel(field: string): string {
    return field.includes('Date') ? 'Newest first' : 'Z to A';
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent): void {
  //   if (
  //     this.isSortPanelVisible &&
  //     this.sortingPanel &&
  //     !this.sortingPanel.nativeElement.contains(event.target)
  //   ) {
  //     this.isSortPanelVisible = false;
  //   }
  // }

  loadData(event: DataViewLazyLoadEvent) {
    this.dataViewLazyLoadEvent = {
      first: (event.first ?? 0) + 1,
      rows: (event.first ?? 0) + (event.rows ?? 25),
      sortField: event.sortField,
      sortOrder: event.sortOrder,
    };

    setTimeout(() => {
      this.dataViewDef.loading = true;

      setTimeout(() => {
        this.lazyLoad.emit(this.dataViewLazyLoadEvent);
      }, 1);
    });
  }

  toggleFilterPanel(): void {
    this.isSortPanelVisible = false;
    this.isFilterPanelVisible = !this.isFilterPanelVisible;
  }

  toggleSortPanel(): void {
    this.isFilterPanelVisible = false;
    this.isSortPanelVisible = !this.isSortPanelVisible;
  }

  onClickApplyFilter() {
    this.toggleFilterPanel();
    setTimeout(() => {
      this.lazyLoad.emit(this.dataViewLazyLoadEvent);
    }, 1);
  }

  onClickApplySorting(): void {
    this.toggleSortPanel();
    setTimeout(() => {
      this.lazyLoad.emit(this.dataViewLazyLoadEvent);
    }, 1);
  }

  refreshData() {
    setTimeout(() => {
      this.lazyLoad.emit(this.dataViewLazyLoadEvent);
    }, 1);
  }

  getStatusList(): void {
    const forTable = this.dataViewDef.tableKey.split('_')[0] + '_' + this.dataViewDef.tableKey.split('_')[1];;
    this.dataviewService.GetStatusList(forTable)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ApiListResponse<StaticList>) => {
          const statusList = res.Data.Items;
          // this.statusList.emit(statusList);
        },
        error: (err) => console.error(err)
      });
  }

  loadFilterList(ColumnName: string) {
    try {
      const model: DataTableFilterListRequest = {
        AreaName: this.tableName[0],
        ControllerName: this.tableName[1],
        TableName: this.tableName[2],
        ColumnName: ColumnName
      };

      this.selectListService.GetDataTableList(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              const dropdownField = this.dataViewDef.filterFields
                ?.find(f => f.type === 'dropdown' && f.field === ColumnName);

              if (dropdownField) {
                dropdownField.options = response.Data.Items;
              }
            }
            else {
              //pending return message in toast mesage
            }
          },
        });
    }
    catch (error) {

    }
  }

  resetForm(formGroup: FormGroup) {
    this.isSortPanelVisible = false;
    this.resetFormEmitter.emit(formGroup);
  }
}
