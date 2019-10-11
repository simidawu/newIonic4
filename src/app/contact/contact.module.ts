import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactComponent } from './contact.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: ContactComponent }])
  ]
})
export class ContactModule { }
