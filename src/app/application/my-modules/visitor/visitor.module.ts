import { NgModule } from '@angular/core';

import { VisitorRoutingModule } from './visitor-routing.module';

import { VisitorService } from './shared/service/visitor.service';

import { VisitorComponent } from './visitor.component';
import { HomeComponent } from './staff/home/home.component';
import { ApplyComponent } from './staff/apply/apply.component';
import { AdminComponent } from './staff/admin/admin.component';
import { SearchComponent } from './staff/search/search.component';
import { CheckComponent } from './staff/check/check.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResultListComponent } from './staff/search/result-list/result-list.component';
import { AformComponent } from './staff/apply/aform/aform.component';
import { FormComponent } from './staff/apply/form/form.component';
import { MainlistComponent } from './staff/check/mainlist/mainlist.component';
import { CheckDetailComponent } from './staff/check/check-detail/check-detail.component';


@NgModule({
  declarations: [
    VisitorComponent,
    HomeComponent,
    ApplyComponent,
    SearchComponent,
    ResultListComponent,
    AformComponent,
    FormComponent,
    CheckComponent,
    AdminComponent,
    MainlistComponent,
    CheckDetailComponent,
  ],
  imports: [
    SharedModule,
    VisitorRoutingModule,
  ],
  providers: [VisitorService],
})
export class VisitorModule { }
