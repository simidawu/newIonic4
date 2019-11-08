import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './search.component';


@NgModule({
  declarations: [SearchComponent],
  imports: [
    SharedModule
  ],
  entryComponents: [SearchComponent],
})
export class SearchComponentModule { }
