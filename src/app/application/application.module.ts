import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../shared/pipe/pipes.module';
import { ApplicationService } from './shared/service/application.service';
import { ApplicationComponent } from './application.component';
import { MoreApplicationComponent } from './more-application/more-application.component';
import { ApplicationGridComponent } from './application-grid/application-grid.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', component: ApplicationComponent },
      { path: 'more', component: MoreApplicationComponent },
    ]),
    PipesModule
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
    ApplicationService
  ]
})
export class ApplicationModule { }
