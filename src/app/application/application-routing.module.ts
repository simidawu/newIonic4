import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { MoreApplicationComponent } from './more-application/more-application.component';

const AppsRoutes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
  },
  { path: 'more', component: MoreApplicationComponent },
  { path: '1', component: MoreApplicationComponent },
  { path: '21', component: MoreApplicationComponent },
  { path: '22', component: MoreApplicationComponent },
  { path: '41', component: MoreApplicationComponent },
  { path: '61', component: MoreApplicationComponent },
  { path: '81', component: MoreApplicationComponent },
  { path: '26023', component: MoreApplicationComponent },
  { path: '26031', component: MoreApplicationComponent },
  { path: '26273', loadChildren: () => import('./my-modules/visitor/visitor.module').then(m => m.VisitorModule) },
  { path: '-1', component: MoreApplicationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(AppsRoutes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule { }
