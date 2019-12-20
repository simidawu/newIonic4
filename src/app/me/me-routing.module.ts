import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeComponent } from './me.component';
import { MeDetailComponent } from './me-detail/me-detail.component';
const MeRoutes: Routes = [
  {
    path: '',
    component: MeComponent,
  },
  { path: 'detail', component: MeDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(MeRoutes)],
  exports: [RouterModule],
})
export class MeRoutingModule { }
