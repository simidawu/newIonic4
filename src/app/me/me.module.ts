import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MeComponent } from './me.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MeComponent],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: MeComponent }])
  ]
})
export class MeModule { }
