import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs.component';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    TabsRoutingModule,
    // RouterModule.forChild([
    //   {
    //     path: '',
    //     component: TabsComponent
    //   }
    // ]),
    SharedModule
  ],
  declarations: [TabsComponent],
  providers: [],
})
export class TabsModule { }
