import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AformComponent } from './aform.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [AformComponent],
  entryComponents: [AformComponent],
})
export class AformComponentModule {}
