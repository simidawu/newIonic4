import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './visitor.component';
import { ApplyComponent } from './staff/apply/apply.component';
import { AformComponent } from './staff/apply/aform/aform.component';
import { HomeComponent } from './staff/home/home.component';

const VisitorRoutes: Routes = [
  {
    path: 'visitor',
    component: VisitorComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'apply', component: ApplyComponent },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/application/visitor/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(VisitorRoutes)],
  exports: [RouterModule],
})
export class VisitorRoutingModule { }
