import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
  ],
  entryComponents: [HomeComponent],
})
export class HomeComponentModule {}
