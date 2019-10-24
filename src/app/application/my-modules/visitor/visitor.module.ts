import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { VisitorRoutingModule } from './visitor-routing.module';

import { VisitorService } from './shared/service/visitor.service';

import { VisitorComponent } from './visitor.component';
import { HomeComponent } from './staff/home/home.component';
import { ApplyComponent } from './staff/apply/apply.component';
import { AdminComponent } from './staff/admin/admin.component';
import { SearchComponent } from './staff/search/search.component';
import { CheckComponent } from './staff/check/check.component';
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
    CommonModule,
    IonicModule,
    VisitorRoutingModule,
    TranslateModule
  ],
  providers: [VisitorService],
})
export class VisitorModule { }
