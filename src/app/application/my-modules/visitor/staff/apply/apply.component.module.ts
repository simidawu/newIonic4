import { NgModule, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ApplyComponent } from './apply.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    // RouterModule.forChild([
    //   { path: '', component: ApplyComponent }
    // ]),
    TranslateModule.forChild(),
  ],
  declarations: [ApplyComponent],
  entryComponents: [ApplyComponent],
})
export class ApplyComponentModule { }
