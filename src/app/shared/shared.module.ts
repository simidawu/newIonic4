import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './pipe/pipes.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { TranslateModule } from '@ngx-translate/core';
import { ColleagueSearcherComponent } from './components/inputs/colleague-searcher/colleague-searcher.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NgZorroAntdModule,
    NgZorroAntdMobileModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule,
  ],
  declarations: [
    ColleagueSearcherComponent,
  ],
  exports: [
    CommonModule,
    IonicModule,
    NgZorroAntdModule,
    NgZorroAntdMobileModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule,
    ColleagueSearcherComponent,
  ],
  entryComponents: [],
  providers: [],
})
export class SharedModule { }
