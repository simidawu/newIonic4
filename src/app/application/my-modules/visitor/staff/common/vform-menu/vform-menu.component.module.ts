import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VFormMenuComponent } from './vform-menu.component';

@NgModule({
  declarations: [VFormMenuComponent],
  imports: [
    TranslateModule.forChild(),
  ],
  entryComponents: [VFormMenuComponent],
})
export class VFormMenuComponentModule {}
