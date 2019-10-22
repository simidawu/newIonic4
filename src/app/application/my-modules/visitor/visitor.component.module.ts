import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VisitorComponent } from './visitor.component';
import { VisitorRoutingModule } from './visitor-routing.module';
import { VisitorService } from './shared/service/visitor.service';
import { HomeComponent } from './staff/home/home.component';
import { ApplyComponent } from './staff/apply/apply.component';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  imports: [
    VisitorRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    VisitorComponent,
    HomeComponent,
    ApplyComponent
  ],
  // entryComponents: [HomeComponent],
  providers: [
    VisitorService
  ]
})
export class VisitorModule { }
