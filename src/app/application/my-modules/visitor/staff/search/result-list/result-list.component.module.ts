import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResultListComponent } from './result-list.component';

@NgModule({
  declarations: [ResultListComponent],
  imports: [
    SharedModule
  ],
  entryComponents: [ResultListComponent],
})
export class ResultListComponentModule { }
