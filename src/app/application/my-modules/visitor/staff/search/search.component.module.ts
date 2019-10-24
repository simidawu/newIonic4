import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from './search.component';



@NgModule({
  declarations: [SearchComponent],
  imports: [
    IonicModule,
    TranslateModule,
  ],
  entryComponents: [SearchComponent],
})
export class SearchComponentModule { }
