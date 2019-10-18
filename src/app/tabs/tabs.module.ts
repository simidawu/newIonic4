import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs.component';

@NgModule({
  imports: [
    CommonModule,
    TabsRoutingModule,
    SharedModule
  ],
  declarations: [TabsComponent],
  providers: [],
})
export class TabsModule { }
