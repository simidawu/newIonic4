import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [SearchComponent],
  imports: [
    SharedModule
  ],
  entryComponents: [SearchComponent],
})
export class SearchComponentModule { }
