import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    SharedModule,
  ],
  entryComponents: [HomeComponent],
})
export class HomeComponentModule {}
