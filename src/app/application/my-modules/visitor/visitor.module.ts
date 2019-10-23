import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { VisitorService } from './shared/service/visitor.service';
import { RouterModule } from '@angular/router';
import { VisitorComponent } from './visitor.component';
import { HomeComponent } from './staff/home/home.component';
import { VisitorRoutingModule } from './visitor-routing.module';
import { ApplyComponent } from './staff/apply/apply.component';


@NgModule({
  declarations: [
    VisitorComponent,
    HomeComponent,
    ApplyComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    VisitorRoutingModule,
  //   RouterModule.forChild([
  //     { path: '', component: VisitorComponent },
  //     { path: 'home', component: HomeComponent },
  //     { path: 'apply', component: ApplyComponent },
  // ])
  ],
  providers: [VisitorService],
})
export class VisitorModule { }
