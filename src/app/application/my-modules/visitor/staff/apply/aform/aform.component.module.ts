import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AformComponent } from './aform.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [AformComponent],
  entryComponents: [AformComponent],
})
export class AformComponentModule {}
