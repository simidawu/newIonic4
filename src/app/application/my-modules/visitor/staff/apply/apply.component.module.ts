import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplyComponent } from './apply.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [ApplyComponent],
  entryComponents: [ApplyComponent],
})
export class ApplyComponentModule { }
