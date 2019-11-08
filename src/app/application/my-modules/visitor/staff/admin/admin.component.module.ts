import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    SharedModule,
  ],
  entryComponents: [AdminComponent],
})
export class AdminComponentModule {}
