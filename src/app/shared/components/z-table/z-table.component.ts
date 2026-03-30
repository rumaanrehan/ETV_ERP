import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
export class ZTableComponent<T> {
  /* Declarations */
  @Input() tableDef!: TableDef<T>;

  tableHeaderDef: TableHeaderColDef[] = [];
  tableSubHeaderDef?: TableHeaderColDef[];
  private defaultColumnVisibility: Map<string, boolean> = new Map<string, boolean>();

  constructor() { }

  ngOnInit() {
    this.applyDefaultColumnVisibility();
    this.generateHeaderStructure();
  }

  private applyDefaultColumnVisibility(): void {
    this.defaultColumnVisibility.clear();

    this.tableDef.columnDef.forEach((col) => {
      if (col.visible === undefined && this.isDefaultHiddenColumn(col.data, col.label)) {
        col.visible = false;
      }

      this.defaultColumnVisibility.set(col.data, col.visible ?? true);
    });
  }

  private isDefaultHiddenColumn(data: string, label: string): boolean {
    const normalizedData = (data ?? '').replace(/\s+/g, '').toLowerCase();
    const normalizedLabel = (label ?? '').replace(/\s+/g, '').toLowerCase();
    return normalizedData === 'uom' || normalizedData === 'hscode' || normalizedLabel === 'uom' || normalizedLabel === 'hscode';
  }

  generateHeaderStructure() {
    this.tableHeaderDef = [];
    this.tableSubHeaderDef = undefined;

    this.tableDef.columnDef.forEach((col) => {
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
            hideVisToggle: false
          });
        }

        this.tableSubHeaderDef = this.tableSubHeaderDef ?? [];
        this.tableSubHeaderDef.push({
          data: col.data,
          label: col.label ?? '',
          cssClass: col.cssClass,
        });
      } else {
        this.tableHeaderDef.push({
          data: col.data,
          label: col.label ?? '',
          visible: col.visible ?? true,
          hideVisToggle: col.hideVisToggle,
          cssClass: col.cssClass
        });
      }
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

  resetColumnVisibility(): void {
    this.tableDef.columnDef.forEach(col => {
      col.visible = this.defaultColumnVisibility.get(col.data) ?? true;
    });

    this.tableHeaderDef.forEach(header => {
      if (header.hasSubHeader) {
        const groupColumnKeys = header.data.split(',').map((item: string) => item.trim());
        header.visible = groupColumnKeys.some((columnKey: string) => (this.defaultColumnVisibility.get(columnKey) ?? true) !== false);
      }
      else {
        header.visible = this.defaultColumnVisibility.get(header.data) ?? true;
      }
    });
  }
}
