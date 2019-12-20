import { NgModule } from '@angular/core';
import { MeDetailComponent } from './me-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MeDetailComponent],
  imports: [
    SharedModule,
    TranslateModule.forChild(),
  ],
  entryComponents: [MeDetailComponent],
})
export class MeDetailComponentModule {}
