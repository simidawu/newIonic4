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
import { FormComponent } from './staff/apply/form/form.component';
import { MainlistComponent } from './staff/check/mainlist/mainlist.component';
import { CheckDetailComponent } from './staff/check/check-detail/check-detail.component';




const VisitorRoutes: Routes = [
  {
    path: '', component: VisitorComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'apply', component: ApplyComponent },
      { path: 'aform', component: AformComponent },
      { path: 'form', component: FormComponent },
      { path: 'search', component: SearchComponent },
      { path: 'result', component: ResultListComponent },
      { path: 'check', component: CheckComponent },
      { path: 'mainlist', component: MainlistComponent },
      { path: 'checkdetail', component: CheckDetailComponent },
      { path: 'admin', component: AdminComponent },
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
