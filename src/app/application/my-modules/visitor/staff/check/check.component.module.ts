import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckComponent } from './check.component';

@NgModule({
  declarations: [CheckComponent],
  imports: [
    SharedModule,
  ],
  entryComponents: [CheckComponent],
})
export class CheckComponentModule { }
