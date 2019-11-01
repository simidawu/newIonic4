import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormComponent } from './form.component';



@NgModule({
  declarations: [FormComponent],
  imports: [
    SharedModule
  ],
  entryComponents: [FormComponent],
})
export class FormComponentModule { }
