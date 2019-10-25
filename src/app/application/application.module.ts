import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../shared/pipe/pipes.module';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationService } from './shared/service/application.service';

import { ApplicationComponent } from './application.component';
import { MoreApplicationComponent } from './more-application/more-application.component';
import { ApplicationGridComponent } from './application-grid/application-grid.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicationRoutingModule,
    TranslateModule.forChild(),
    PipesModule,
  ],
  declarations: [
    ApplicationComponent,
    MoreApplicationComponent,
    ApplicationGridComponent,
  ],
  exports: [
    ApplicationComponent,
    MoreApplicationComponent,
    ApplicationGridComponent,
  ],
  entryComponents: [
    ApplicationComponent,
    MoreApplicationComponent,
    ApplicationGridComponent,
  ],
  providers: [
    ApplicationService,
  ]
})
export class ApplicationModule { }
