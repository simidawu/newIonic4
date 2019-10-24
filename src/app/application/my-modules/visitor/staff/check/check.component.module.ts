import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CheckComponent } from './check.component';



@NgModule({
  declarations: [CheckComponent],
  imports: [
    IonicModule,
    TranslateModule,
  ],
  entryComponents: [CheckComponent],
})
export class CheckComponentModule { }
