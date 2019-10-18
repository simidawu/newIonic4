import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { VisitorService } from './shared/service/visitor.service';
import { RouterModule } from '@angular/router';
import { VisitorComponent } from './visitor.component';


@NgModule({
  declarations: [
    VisitorComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: VisitorComponent }])
  ],
  providers: [VisitorService],
})
export class VisitorModule { }
