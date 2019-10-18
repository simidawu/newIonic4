import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './visitor.component';
import { ApplyComponent } from './staff/apply/apply.component';
import { AformComponent } from './staff/apply/aform/aform.component';
import { HomeComponent } from './staff/home/home.component';

const VisitorRoutes: Routes = [
  {
    path: '',
    component: VisitorComponent,
  },
  {
    path: 'apply', component: ApplyComponent, children: [
      { path: 'aform/:type', component: AformComponent }
    ]
  },
  { path: 'home', component: HomeComponent },
  // {
  //   path: 'stock/:id', component: StockComponent, data: [{isPro: true}],
  //    children: [
  //       {path: '', component: BuyerListComponent},
  //       {path: 'seller/:id', component: SellerListComponent}

  //    ],
  // },
  // { path: 'more', component: MoreApplicationComponent },
  // { path: '1', component: MoreApplicationComponent },
  // { path: '21', component: MoreApplicationComponent },
  // { path: '22', component: MoreApplicationComponent },
  // { path: '41', component: MoreApplicationComponent },
  // { path: '61', component: MoreApplicationComponent },
  // { path: '81', component: MoreApplicationComponent },
  // { path: '26023', component: MoreApplicationComponent },
  // { path: '26031', component: MoreApplicationComponent },
  // { path: '26273', component: MoreApplicationComponent },
  // { path: '-1', component: MoreApplicationComponent },

];

@NgModule({
  imports: [RouterModule.forChild(VisitorRoutes)],
  exports: [RouterModule],
})
export class VisitorRoutingModule { }
