import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DataTableDef, DataTableHeaderColDef, DataTableLazyLoadEvent } from './z-datatable';
import { first, last, Subject, takeUntil } from 'rxjs';
import { DataTableFilterList, DataTableFilterListRequest, StaticList } from '../../models/select-list';
import { SelectListService } from '../../services/select-list.service';
import { ZFormControlsModule } from '../z-form-controls/z-form-controls.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DataViewSortRow } from '../z-dataview/z-dataview';

@Component({
  selector: 'z-datatable',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, OverlayPanelModule, CheckboxModule, ZFormControlsModule, SelectButtonModule],
  templateUrl: './z-datatable.component.html',
  styleUrl: './z-datatable.component.scss'
})
export class ZDataTable<T> {
  private destroy$ = new Subject<void>();
  @ViewChild('dt') table!: Table;
  @ViewChild('sortingPanel') sortingPanel!: ElementRef;
  @ViewChild('filterPanel') filterPanel!: ElementRef;
  /* Declarations */
  @Input() tableDef!: DataTableDef<T>;
  @Output() lazyLoad: EventEmitter<DataTableLazyLoadEvent> = new EventEmitter();
  @Output() resetFormEmitter = new EventEmitter<FormGroup>();

  tableStateKey!: string;
  tableName!: string[];
  tableHeaderDef: DataTableHeaderColDef[] = [];
  tableSubHeaderDef?: DataTableHeaderColDef[];
  showFilterPanel: boolean = false;
  isSortPanelVisible: boolean = false;
  selectedRow: any;
  tableLazyLoadEvent!: DataTableLazyLoadEvent;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isClickInsideSort = this.sortingPanel?.nativeElement.contains(target);
    const isClickInsideFilter = this.filterPanel?.nativeElement.contains(target);
    const isClickOnToggle = target.closest('.refresh-filter') || target.closest('.filter-toggle') || target.closest('.column-visibility-toggle') || target.closest('.p-overlaypanel');
    const isClickInsideOverlay = target.closest('.p-dropdown-panel') || target.closest('.p-multiselect-panel') || target.closest('.p-datepicker') || target.closest('.p-overlay');

    if (!isClickInsideSort && !isClickInsideFilter && !isClickOnToggle && !isClickInsideOverlay) {
      this.isSortPanelVisible = false;
      this.showFilterPanel = false;
    }
  }

  isServiceAccountCodeList: any[] = [
    { Value: 1, Text: 'Yes' },
    { Value: 2, Text: 'No' },
    { Value: 0, Text: 'All' }
  ];

  isApprovalRequiredList: any[] = [
    { Value: 1, Text: 'Yes' },
    { Value: 2, Text: 'No' },
    { Value: 0, Text: 'All' }
  ];

  companyTypeList: any[] = [
    { Value: 1, Text: 'Client' },
    { Value: 2, Text: 'Vendor' },
    { Value: 0, Text: 'All' }
  ];

  activeStatusList: any[] = [
    { Value: 1, Text: 'Active' },
    { Value: 2, Text: 'Inactive' },
    { Value: 0, Text: 'All' }
  ];

  IsServiceAccountCodeID: any[] = [
    { Value: 1, Text: 'Yes' },
    { Value: 2, Text: 'No' },
    { Value: 0, Text: 'All' }
  ];

  constructor(
    private selectListService: SelectListService
  ) { }

  ngOnInit() {
    this.tableStateKey = `ZDataTable_${this.tableDef.tableKey}`;
    this.tableName = this.tableDef.tableKey.split('_');

    this.generateHeaderStructure();

    const tableSessionState = sessionStorage.getItem(this.tableStateKey);
    if (tableSessionState) {
      const tableSessionKeyData: { [key: string]: any } = JSON.parse(tableSessionState || '{}');

      /* Sort */
      if (tableSessionKeyData['sortField']) {
        this.tableDef.defaultSortColumn.sortField = tableSessionKeyData['sortField'];
      }
      if (tableSessionKeyData['sortOrder']) {
        this.tableDef.defaultSortColumn.sortOrder = tableSessionKeyData['sortOrder'];
      }

      /* Filters */
      const filters = tableSessionKeyData['filters'];
      if (filters) {
        const filterFormValues: { [key: string]: string | null } = Object.keys(filters).reduce((acc: { [key: string]: string | null }, key: string) => {
          if (filters[key]?.value) {
            acc[key] = filters[key]?.value;
          }
          return acc;
        }, {});

        if (filterFormValues) {
          this.tableDef.filterForm?.patchValue(filterFormValues);
        }
      }
    }
  }

  generateHeaderStructure() {
    this.tableDef.columnDef.forEach((col) => {
      if (col.filterable && col.filterType == 'select') {
        if (col.filterKey == 'ActiveStatusID') {
          col.filterSelectList = this.activeStatusList;
        }
        else if (col.filterKey == 'IsApprovalRequired') {
          col.filterSelectList = this.isApprovalRequiredList;
        }
        else if (col.filterKey == 'IsServiceAccountCodeID') {
          col.filterSelectList = this.isServiceAccountCodeList;
        }
        else if (col.filterKey == 'CompanyTypeID') {
          col.filterSelectList = this.companyTypeList;
        }
        else if (col.filterKey == 'IsServiceAccountCodeID') {
          col.filterSelectList = this.companyTypeList;
        }
        else {
          this.loadFilterList(col.filterKey);
        }
      }

      if (col.visible === false) {
        return;
      }

      if (col.groupLabel) {
        const existingGroup = this.tableHeaderDef.find(
          (header) => header.label === col.groupLabel
        );

        if (existingGroup && existingGroup.colSpan) {
          existingGroup.colSpan++;
          existingGroup.data += "," + col.data;
        }
        else {
          this.tableHeaderDef.push({
            data: col.data,
            label: col.groupLabel,
            hasSubHeader: true,
            colSpan: 1,
            visible: col.visible ?? true,
            hideVisToggle: false,
            orderable: false
          });
        }

        this.tableSubHeaderDef = this.tableSubHeaderDef ?? [];
        this.tableSubHeaderDef.push({
          data: col.data,
          label: col.label ?? '',
          visible: col.visible ?? true,
          orderable: col.orderable,
          cssClass: col.cssClass,
        });
      } else {
        this.tableHeaderDef.push({
          data: col.data,
          label: col.label ?? '',
          visible: col.visible ?? true,
          hideVisToggle: col.hideVisToggle,
          orderable: col.orderable,
          cssClass: col.cssClass
        });
      }
    });

    this.tableDef.filterFields
      ?.filter(f => f.type === 'dropdown')
      .forEach(f => {
        this.loadFilterList(f.field);
      });
  }

  loadStatusList(ColumnName: string) {
    try {
      this.selectListService.GetStatusList(`${this.tableName[0]}_${this.tableName[1]}`)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              const targetRow = this.tableDef.columnDef.find(row => (row.filterKey) === ColumnName);
              if (targetRow && targetRow.filterType == 'select') {
                const staticList: StaticList[] = response.Data.Items;
                const mappedList: DataTableFilterList[] = staticList.map(item => ({
                  Value: item.iValue,
                  Text: item.Text
                }));

                targetRow.filterSelectList = mappedList;
              }
            }
            else {
              //pending return message in toast mesage
            }
          },
          error: (err) => {
            console.error('Error loading status list:', err);
          }
        });
    }
    catch (error) {

    }
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
              const targetRow = this.tableDef.columnDef.find(row => (row.filterKey) === ColumnName);
              if (targetRow && targetRow.filterType == 'select') {
                targetRow.filterSelectList = response.Data.Items;
              }

              const dropdownField = this.tableDef.filterFields
                ?.find(f => f.type === 'dropdown' && f.field === ColumnName);
              if (dropdownField) {
                dropdownField.options = response.Data.Items;
              }
            }
            else {
              //pending return message in toast mesage
            }
          },
          error: (err) => {
            console.error('Error loading filter list:', err);
          }
        });
    }
    catch (error) {

    }
  }

  toggleFilterPanel() {
    this.isSortPanelVisible = false;
    this.showFilterPanel = !this.showFilterPanel;
  }

  onClickApplyFilter() {
    this.toggleFilterPanel();
    setTimeout(() => {
      this.lazyLoad.emit(this.tableLazyLoadEvent);
    }, 1);
  }

  onFilter(event: any) {
    this.table.saveState();
  }

  toggleSortPanel(): void {
    this.showFilterPanel = false;
    this.isSortPanelVisible = !this.isSortPanelVisible;
  }

  onClickApplySorting(): void {
    this.toggleSortPanel();
    setTimeout(() => {
      this.lazyLoad.emit(this.tableLazyLoadEvent);
    }, 1);
  }

  getAscLabel(field: string): string {
    return field.includes('Date') ? 'Oldest first' : 'A to Z';
  }

  getDescLabel(field: string): string {
    return field.includes('Date') ? 'Newest first' : 'Z to A';
  }

  resetForm(formGroup: FormGroup) {
    this.isSortPanelVisible = false;
    this.showFilterPanel = false;
    this.resetFormEmitter.emit(formGroup);
  }

  loadData(event: TableLazyLoadEvent) {
    this.tableLazyLoadEvent = {
      first: (event.first ?? 0) + 1,
      last: (event.first ?? 0) + (event.rows ?? 25),
      sortField: event.sortField,
      sortOrder: event.sortOrder,
    };

    setTimeout(() => {
      this.tableDef.loading = true;

      setTimeout(() => {
        this.lazyLoad.emit(this.tableLazyLoadEvent);
      }, 1);
    });
  }

  onChangeColVisSwitch(toggledData: any): void {
    if (toggledData.hasSubHeader) {
      toggledData.data.split(',').forEach((colName: string) => {
        this.tableDef.columnDef.forEach(col => {
          if (col.data === colName) {
            col.visible = toggledData.visible;
          }
        });
        this.tableSubHeaderDef?.forEach(col => {
          if (col.data === colName) {
            col.visible = toggledData.visible;
          }
        });
      });
    }
    else {
      this.tableDef.columnDef.forEach(col => {
        if (col.data === toggledData.data) {
          col.visible = toggledData.visible;
        }
      });
    }
  }

  refreshData() {
    setTimeout(() => {
      this.lazyLoad.emit(this.tableLazyLoadEvent);
    }, 1);
  }
}