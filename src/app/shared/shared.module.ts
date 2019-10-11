import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PipesModule } from './pipe/pipes.module';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PipesModule,
  ],
  entryComponents: [],
  providers: [],
})
export class SharedModule {}
