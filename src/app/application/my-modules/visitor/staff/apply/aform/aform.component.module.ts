import { SharedModule } from '../../../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// import { MultiPickerModule } from 'ion-multi-picker';
import { AformComponent } from './aform.component';

@NgModule({
  imports: [
    TranslateModule,
    SharedModule,
    // MultiPickerModule,
  ],
  declarations: [AformComponent],
  entryComponents: [AformComponent],
})
export class AformComponentModule {}
