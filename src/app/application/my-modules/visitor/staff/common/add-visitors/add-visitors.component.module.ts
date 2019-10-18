import { SharedModule } from '../../../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AddVisitorsComponent } from './add-visitors.component';

@NgModule({
  imports: [
    TranslateModule.forChild(),
    SharedModule,
  ],
  exports: [],
  declarations: [AddVisitorsComponent],
  providers: [],
  entryComponents: [AddVisitorsComponent],
})
export class AddVisitorsComponentModule {}
