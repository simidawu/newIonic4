import { SharedModule } from '../../../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AddGoodsComponent } from './add-goods.component';

@NgModule({
  imports: [
    TranslateModule.forChild(),
    SharedModule,
  ],
  declarations: [AddGoodsComponent],
  entryComponents: [AddGoodsComponent],
})
export class AddGoodsComponentModule {}
