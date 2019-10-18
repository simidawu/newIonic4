import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VisitorComponent } from './visitor.component';
import { VisitorRoutingModule } from './visitor-routing.module';
import { VisitorService } from './shared/service/visitor.service';


@NgModule({
  imports: [
    VisitorRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [VisitorComponent],
  entryComponents: [VisitorComponent],
  providers: [
    VisitorService
  ]
})
export class VisitorModule { }
