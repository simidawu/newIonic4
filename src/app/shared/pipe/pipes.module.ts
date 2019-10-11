// import { MyFlexPipe } from './my-flex.pipe';
// import { SearchColleaguePipe } from './search-colleague.pipe';
import { NgModule } from '@angular/core';
import { ChineseConv } from './chinese-conv.pipe';
import { TrustHtmlPipe } from './trustHtml.pipe';

@NgModule({
  declarations: [
    ChineseConv,
    // SearchColleaguePipe,
    // MyFlexPipe,
    TrustHtmlPipe],
  exports: [
    ChineseConv,
    // SearchColleaguePipe,
    // MyFlexPipe,
    TrustHtmlPipe],
})
export class PipesModule { }
