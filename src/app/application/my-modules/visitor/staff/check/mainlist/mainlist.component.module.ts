import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainlistComponent } from './mainlist.component';

@NgModule({
  declarations: [MainlistComponent],
  imports: [
    SharedModule,
  ],
  entryComponents: [MainlistComponent],
})
export class MainlistComponentModule {}
