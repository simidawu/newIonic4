import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ResultListComponent } from './result-list.component';

@NgModule({
  declarations: [ResultListComponent],
  imports: [
    IonicModule,
    TranslateModule,
  ],
  entryComponents: [ResultListComponent],
})
export class ResultListComponentModule { }
