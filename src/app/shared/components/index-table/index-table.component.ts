import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Signal, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

export interface IndexTableParams<T> {
  tableKey?: string;
  columnDef: IndexTableColumnDef[];
  defaultSortColumn: IndexTableDefaultSort;
  tableFilterForm?: FormGroup;
  data: T[];
  totalRecords: number;
  loading: boolean;
}

export interface IndexTableColumnDef {
  data: string;
  label?: string;
  groupLabel?: string;
  orderable?: boolean;
  visible?: boolean;
  excludeVisibleToggle?: boolean;
  hasFilter?: boolean;
  filterType?: string;
  filterData?: any;
  filterKey?: any;
  cssClass?: string;
  width?: string;
  customTemplate?: TemplateRef<any>;
}

// export interface IndexTableColumnFilter {
//   type?: string;
//   listData?: any[];

// }

export interface IndexTableDefaultSort {
  sortField: string;
  sortOrder: number
}

// interface IndexTableHeaderDef {
//   key: number;
//   ColDef: IndexTableHeaderColDef;
// }

// interface IndexTableHeaderColDef {
//   label: string;
//   colSpan: string;
// }

interface IndexTableHeaderColDef {
  data: string;
  label: string;
  hasSubHeader?:boolean;
  excludeVisibleToggle?: boolean;
  cssClass?: string;
  colSpan: number;
  orderable?: boolean;
  visible: boolean;
}

export interface IndexTableParamsMusab<T> {
  first?: number | undefined | null;
  rows?: number | undefined | null;
  sortField?: string | string[] | null | undefined;
  sortOrder?: number | undefined | null;
  filters?: T;
}

@Component({
  selector: 'app-index-table',
  standalone: true,
  imports: [CommonModule, TableModule, OverlayPanelModule, CheckboxModule, FormsModule, DropdownModule, ReactiveFormsModule],
  templateUrl: './index-table.component.html',
  styleUrl: './index-table.component.scss'
})
export class IndexTableComponent<T> implements OnInit {
  /* Declarations */
  @Input() tableDef!: IndexTableParams<T>;
  @Output() lazyLoad: EventEmitter<TableLazyLoadEvent> = new EventEmitter();

  // groupedColumns: any[] = []; // Columns grouped by `parent`
  tableStateKey!: string;
  showFilterPanel: boolean = false;
  selectedRow: any;
  // firstLevelHeaders: any = {};
  tableHeaderColDef: IndexTableHeaderColDef[][] = [];
  tableHeaderDef: IndexTableHeaderColDef[] = [];
  tableSubHeaderDef?: IndexTableHeaderColDef[];
  tableFilterForm!: FormGroup;
  filters: { [key: string]: any } = {};

  constructor(private fb: FormBuilder) {}
  // rows = 10; // Default rows per page
  // pageIndex = 0; // Current page index
  // totalPages = 0; // Total number of pages
  // pageSizes = [5, 10, 20, 50]; // Available page sizes
  // currentPageReport = '';

  ngOnInit() {
    this.tableStateKey = `indexTable-${this.tableDef.tableKey ?? ''}`;

    this.tableFilterForm = this.fb.group({
      PlanCode: new FormControl(),
      PlanName: new FormControl(),
      BillCompanyName: new FormControl(),
      PlanTypeID: new FormControl(),
      ActiveStatus: new FormControl()
    });

    const savedFilters = sessionStorage.getItem(this.tableStateKey);
    if (savedFilters) {
      this.filters = JSON.parse(savedFilters);
      const filters1 = this.filters['filters'];

      const formValues: { [key: string]: string | null } = Object.keys(filters1).reduce((acc: { [key: string]: string | null }, key: string) => {
        acc[key] = filters1[key]?.value || ''; // Default to an empty string if value is null
        return acc;
      }, {});

      console.log(this.filters['filters']);

      // Update the form controls with the restored values
      this.tableFilterForm.patchValue(formValues);
      console.log(this.tableFilterForm.value);
    }
    // this.tableFilterForm = new FormGroup({
    //   PlanCode: new FormControl(),
    //   PlanName: new FormControl(),
    //   BillCompanyName: new FormControl(),
    //   PlanTypeName: new FormControl(),
    //   ActiveStatus: new FormControl()
    // });


    // this.groupColumns();
    // this.getFirstLevelHeaders();
    this.generateHeaderStructure();


    // this.formGroup.valueChanges.subscribe((formValues) => {
    //   this.filters = Object.keys(formValues).reduce((acc, key) => {
    //     acc[key] = { value: formValues[key], matchMode: 'contains' }; // Default matchMode
    //     return acc;
    //   }, {});

    //   console.log('Updated Filters:', this.filters);
    // });
  }

  generateHeaderStructure() {
    const topLevelHeaders: IndexTableHeaderColDef[] = [];
    const secondLevelHeaders: IndexTableHeaderColDef[] = [];
    let index = 0;
  
    this.tableDef.columnDef.forEach((col) => {
      if (col.visible === false) {
        return; // Skip hidden columns
      }
  
      if (col.groupLabel) {
        // Find or create the top-level group header
        const existingGroup = topLevelHeaders.find(
          (header) => header.label === col.groupLabel
        );
  
        if (existingGroup) {
          // Increment the colSpan of the existing group
          existingGroup.colSpan++;
          existingGroup.data += "," + col.data;
        } else {
          // Add a new top-level header
          topLevelHeaders.push({
            data: col.data,
            label: col.groupLabel,
            hasSubHeader: true,
            colSpan: 1,
            orderable: false,
            visible: col.visible ?? true,
            excludeVisibleToggle: false
          });
          index++;
        }
  
        // Add a second-level header for this column
        secondLevelHeaders.push({
          data: col.data,
          label: col.label ?? '',
          cssClass: col.cssClass,
          colSpan: 1,
          orderable: col.orderable,
          visible: col.visible ?? true
        });
      } else {
        // Add an ungrouped column to both levels
        topLevelHeaders.push({
          data: col.data,
          label: col.label ?? '',
          cssClass: col.cssClass,
          colSpan: 1,
          orderable: col.orderable,
          visible: col.visible ?? true,
          excludeVisibleToggle: col.excludeVisibleToggle
        });
        // secondLevelHeaders.push({
        //   key: secondLevelHeaders.length,
        //   colDef: {
        //     label: '',
        //     colSpan: 1,
        //   },
        // });
        index++;
      }
    });
    this.tableHeaderDef = topLevelHeaders;
    this.tableSubHeaderDef = secondLevelHeaders;
    this.tableHeaderColDef = [topLevelHeaders, secondLevelHeaders];
    console.log(this.tableSubHeaderDef);
  }

  // getFirstLevelHeaders() {
  //   const headers: IndexTableHeaderDef[] = [];
  //   const headerMap: { [key: number]: string } = {};
  //   let index = 0;
  
  //   const processedGroups = new Set<string>(); // To avoid duplicate groupLabels.
  //   // headers.push({ key: 0, ColDef: {} });
  
  //   this.tableDef.columnDef.forEach((col) => {
  //     if (col.groupLabel) {
  //       // Handle grouped columns
  //       if (!processedGroups.has(col.groupLabel)) {
  //         // headers.push({ key: index, label: col.groupLabel });
  //         headerMap[index] = col.groupLabel;
  //         processedGroups.add(col.groupLabel);
  //         index++;
  //       }
  //     } else {
  //       // Handle individual columns
  //       // headers.push({ key: index, label: col.label ?? '' });
  //       headerMap[index] = col.label ?? '';
  //       index++;
  //     }
  //   });
  //   // console.log(headerMap);
  //   // console.log(headers);
  
  //   this.firstLevelHeaders = headerMap;
  // }

  // groupColumns() {
  //   const grouped: { [key: string]: any[] } = {}; // Grouped columns by parent
  //   const ungrouped: any[] = []; // Explicitly type as an array of objects

  //   const groupHeader: { [key: string]: {} } = {};

  //   this.tableDef.columnDef.forEach((col) => {
  //     if (col.groupLabel) {
  //       if (!grouped[col.groupLabel]) {
  //         grouped[col.groupLabel] = [];
  //       }
  //       grouped[col.groupLabel].push(col);
  //     } else {
  //       ungrouped.push(col);
  //     }
  //   });


  
  //   this.tableDef.columnDef.forEach((col) => {
  //     if (col.groupLabel) {
  //       if (!grouped[col.groupLabel]) {
  //         grouped[col.groupLabel] = [];
  //       }
  //       grouped[col.groupLabel].push(col);
  //     } else {
  //       ungrouped.push(col);
  //     }
  //   });
  
  //   this.groupedColumns = Object.entries(grouped).map(([parent, cols]) => ({
  //     parent,
  //     cols,
  //   }));
  
  //   // Add ungrouped columns as individual entries
  //   ungrouped.forEach((col) => {
  //     this.groupedColumns.push({ parent: col.header, cols: [col], isUngrouped: true });
  //   });

  //   // console.log(grouped);
  //   // console.log(ungrouped);
  // }

  // loadData1(event: IndexTableMusab) {
  //   console.log(event);
  //   setTimeout(() => {
  //     this.tableDef.loading = true;

  //     setTimeout(() => {
  //       this.lazyLoad.emit(event);
  //     }, 1);
  //   });
  // }

  loadData(event: TableLazyLoadEvent) {
    console.log(event);
    setTimeout(() => {
      this.tableDef.loading = true;

      setTimeout(() => {
        this.lazyLoad.emit(event);
      }, 1);
    });
  }

  onFilter(event: any){
  }

  isRowSelectable(row: any): boolean {
    console.log('Hogye hain');
    return true;
  }

  // paginate(action: string) {
  //   switch (action) {
  //     case 'first':
  //       this.pageIndex = 0;
  //       break;
  //     case 'prev':
  //       this.pageIndex = Math.max(this.pageIndex - 1, 0);
  //       break;
  //     case 'next':
  //       this.pageIndex = Math.min(this.pageIndex + 1, this.totalPages - 1);
  //       break;
  //     case 'last':
  //       this.pageIndex = this.totalPages - 1;
  //       break;
  //   }

  //   // Trigger data load for the new page
  //   this.loadData({ first: this.pageIndex * this.rows, rows: this.rows });
  // }

  // onPageSizeChange(event: Event) {
  //   this.rows = Number((event.target as HTMLSelectElement).value);
  //   this.pageIndex = 0; // Reset to the first page
  //   this.loadData({ first: 0, rows: this.rows });
  // }

  // updateCurrentPageReport() {
  //   const first = this.pageIndex * this.rows + 1;
  //   const last = Math.min((this.pageIndex + 1) * this.rows, this.tableDef.totalRecords);
  //   this.currentPageReport = `Showing ${first} to ${last} of ${this.tableDef.totalRecords} entries`;
  // }

  toggleFilterPanel(){
    this.showFilterPanel = !this.showFilterPanel;
  }

  onVisibilityChange(toggledData: any): void {
    console.log(toggledData);
    // Find the corresponding header and update its visibility
    if(toggledData.hasSubHeader){
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
    else{
      this.tableDef.columnDef.forEach(col => {
        if (col.data === toggledData.data) {
          col.visible = toggledData.visible;
        }
      });
    }
    
    // console.log(this.tableHeaderColDef);
  }

  onFilter1(event: any){
    console.log(this.tableFilterForm.value);
  }
}
