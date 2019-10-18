import { SharedModule } from '../../../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AddEmployeesComponent } from './add-employees.component';

@NgModule({
  imports: [
    TranslateModule.forChild(),
    SharedModule,
  ],
  exports: [],
  declarations: [AddEmployeesComponent],
  providers: [],
  entryComponents: [AddEmployeesComponent],
})
export class AddEmployeesComponentModule {}
