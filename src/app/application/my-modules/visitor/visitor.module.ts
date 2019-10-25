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
// import { AformComponent } from './staff/apply/aform/aform.component';


@NgModule({
  declarations: [
    VisitorComponent,
    HomeComponent,
    ApplyComponent,
    SearchComponent,
    // AformComponent,
    CheckComponent,
    AdminComponent,
  ],
  imports: [
    SharedModule,
    VisitorRoutingModule,
  ],
  providers: [VisitorService],
})
export class VisitorModule { }
