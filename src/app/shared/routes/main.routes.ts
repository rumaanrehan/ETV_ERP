import { Routes } from '@angular/router';
import { EmptypageComponent } from '../../components/emptypage/emptypage.component';
import { DataTableComponent } from '../../components/data-table/data-table.component';

export const mainRoute: Routes = [
  { path: 'emptypage', component: EmptypageComponent },
  { path: 'datatable', component: DataTableComponent },
  { path: '', loadChildren: () => import('../../modules/admin/admin.routes').then((m) => m.adminRoute) }
];
