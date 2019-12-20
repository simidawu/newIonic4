import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MeComponent } from './me.component';
import { RouterModule } from '@angular/router';
import { MeRoutingModule } from './me-routing.module';
import { MeDetailComponent } from './me-detail/me-detail.component';
import { SharedModule } from '../shared/shared.module';
import { MeService } from './shared/service/me.service';



@NgModule({
  declarations: [
    MeComponent,
    MeDetailComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    MeRoutingModule,
    // RouterModule.forChild([{ path: '', component: MeComponent }])
  ],
  providers: [MeService],
})
export class MeModule { }
