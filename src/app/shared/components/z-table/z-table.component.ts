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
  imports: [CommonModule,FormsModule,TableModule,OverlayPanelModule,CheckboxModule],
  templateUrl: './z-table.component.html',
  styleUrls: ['./z-table.component.scss'],
})
export class ZTableComponent<T> {
  /* Declarations */
  @Input() tableDef!: TableDef<T>;

  tableHeaderDef: TableHeaderColDef[] = [];
  tableSubHeaderDef?: TableHeaderColDef[];
  
  constructor( ) {}

  ngOnInit() {
    this.generateHeaderStructure();
  }

  generateHeaderStructure() {
    this.tableDef.columnDef.forEach((col) => {
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
  }
}