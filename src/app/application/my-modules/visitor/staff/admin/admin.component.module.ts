import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    IonicModule,
    TranslateModule,
  ],
  entryComponents: [AdminComponent],
})
export class AdminComponentModule {}
