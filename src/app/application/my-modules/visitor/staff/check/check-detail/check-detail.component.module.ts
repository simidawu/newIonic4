import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckDetailComponent } from './check-detail.component';

@NgModule({
  declarations: [CheckDetailComponent],
  imports: [
    SharedModule,
  ],
  entryComponents: [CheckDetailComponent],
})
export class CheckDetailComponentModule { }
