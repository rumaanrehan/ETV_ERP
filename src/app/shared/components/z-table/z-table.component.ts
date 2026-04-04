import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { TableHeaderColDef, TableDef } from './z-table';

@Component({
  selector: 'z-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, OverlayPanelModule, CheckboxModule],
  templateUrl: './z-table.component.html',
  styleUrls: ['./z-table.component.scss'],
})
export class ZTableComponent<T> implements OnInit, OnChanges {
  /* Declarations */
  @Input() tableDef!: TableDef<T>;

  tableHeaderDef: TableHeaderColDef[] = [];
  tableSubHeaderDef?: TableHeaderColDef[];
  private defaultColumnVisibility: boolean[] = [];

  constructor() { }

  ngOnInit(): void {
    this.refreshTableConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableDef']) {
      this.refreshTableConfig();
    }
  }

  private refreshTableConfig(): void {
    if (!this.tableDef?.columnDef?.length) {
      this.tableHeaderDef = [];
      this.tableSubHeaderDef = undefined;
      this.defaultColumnVisibility = [];
      return;
    }

    this.applyDefaultColumnVisibility();
    this.generateHeaderStructure();
  }

  private applyDefaultColumnVisibility(): void {
    this.defaultColumnVisibility = [];

    this.tableDef.columnDef.forEach((col, index) => {
      if (col.visible === undefined && this.isDefaultHiddenColumn(col.data, col.label)) {
        col.visible = false;
      }

      this.defaultColumnVisibility[index] = col.visible ?? true;
    });
  }

  private isDefaultHiddenColumn(data: string, label: string): boolean {
    const normalizedData = (data ?? '').replace(/\s+/g, '').toLowerCase();
    const normalizedLabel = (label ?? '').replace(/\s+/g, '').toLowerCase();
    return normalizedData === 'uom'
      || normalizedData === 'hscode'
      || normalizedData === 'hsncode'
      || normalizedLabel === 'uom'
      || normalizedLabel === 'hscode'
      || normalizedLabel === 'hsncode';
  }

  generateHeaderStructure() {
    this.tableHeaderDef = [];
    this.tableSubHeaderDef = undefined;

    this.tableDef.columnDef.forEach((col, index) => {
      if (col.groupLabel) {
        const existingGroup = this.tableHeaderDef.find(
          (header) => header.label === col.groupLabel
        );

        if (existingGroup && existingGroup.colSpan) {
          existingGroup.colSpan++;
          existingGroup.data += "," + col.data;
          existingGroup.columnIndexes = [...(existingGroup.columnIndexes ?? []), index];
        }
        else {
          this.tableHeaderDef.push({
            data: col.data,
            label: col.groupLabel,
            hasSubHeader: true,
            colSpan: 1,
            visible: col.visible ?? true,
            hideVisToggle: false,
            columnIndexes: [index]
          });
        }

        this.tableSubHeaderDef = this.tableSubHeaderDef ?? [];
        this.tableSubHeaderDef.push({
          data: col.data,
          label: col.label ?? '',
          cssClass: col.cssClass,
          visible: col.visible ?? true,
          columnIndexes: [index]
        });
      } else {
        this.tableHeaderDef.push({
          data: col.data,
          label: col.label ?? '',
          visible: col.visible ?? true,
          hideVisToggle: col.hideVisToggle,
          cssClass: col.cssClass,
          columnIndexes: [index]
        });
      }
    });
  }

  onChangeColVisSwitch(toggledData: any): void {
    if (toggledData.hasSubHeader) {
      const columnIndexes: number[] = toggledData.columnIndexes ?? [];
      if (columnIndexes.length > 0) {
        columnIndexes.forEach((index) => {
          if (this.tableDef.columnDef[index]) {
            this.tableDef.columnDef[index].visible = toggledData.visible;
          }
        });
        this.tableSubHeaderDef?.forEach((subHeader) => {
          const subHeaderIndex = subHeader.columnIndexes?.[0];
          if (subHeaderIndex !== undefined && columnIndexes.includes(subHeaderIndex)) {
            subHeader.visible = toggledData.visible;
          }
        });
      } else {
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
    }
    else {
      const columnIndex = toggledData.columnIndexes?.[0];
      if (columnIndex !== undefined && this.tableDef.columnDef[columnIndex]) {
        this.tableDef.columnDef[columnIndex].visible = toggledData.visible;
      } else {
        this.tableDef.columnDef.forEach(col => {
          if (col.data === toggledData.data) {
            col.visible = toggledData.visible;
          }
        });
      }
    }
  }

  resetColumnVisibility(): void {
    this.tableDef.columnDef.forEach((col, index) => {
      col.visible = this.defaultColumnVisibility[index] ?? true;
    });

    this.tableHeaderDef.forEach(header => {
      const headerIndexes = header.columnIndexes ?? [];
      if (headerIndexes.length > 0) {
        header.visible = headerIndexes.some((index) => (this.defaultColumnVisibility[index] ?? true) !== false);
      }
      else {
        header.visible = true;
      }
    });

    this.tableSubHeaderDef?.forEach(subHeader => {
      const subHeaderIndex = subHeader.columnIndexes?.[0];
      subHeader.visible = subHeaderIndex !== undefined
        ? (this.defaultColumnVisibility[subHeaderIndex] ?? true)
        : true;
    });
  }
}
