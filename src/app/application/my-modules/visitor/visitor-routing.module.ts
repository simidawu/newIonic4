import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisitorComponent } from './visitor.component';
import { HomeComponent } from './staff/home/home.component';
import { ApplyComponent } from './staff/apply/apply.component';
import { SearchComponent } from './staff/search/search.component';
import { AformComponent } from './staff/apply/aform/aform.component';
import { CheckComponent } from './staff/check/check.component';
import { AdminComponent } from './staff/admin/admin.component';
import { ResultListComponent } from './staff/search/result-list/result-list.component';




const VisitorRoutes: Routes = [
  {
    path: '', component: VisitorComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'apply', component: ApplyComponent },
      { path: 'search', component: SearchComponent },
      { path: 'result', component: ResultListComponent },
      { path: 'check', component: CheckComponent },
      { path: 'admin', component: AdminComponent },
      // { path: 'aform', component: AformComponent },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(VisitorRoutes)],
  exports: [RouterModule],
})
export class VisitorRoutingModule { }
