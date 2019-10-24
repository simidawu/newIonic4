import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Store, StoreModule } from '@ngrx/store';
import { userReducer } from './shared/reducers/user.reducer';

import { CoreModule } from './core/core.module';
import { LocalStorageService } from './core/services/localStorage.service';
import { LoginService } from './login/shared/service/login.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PipesModule } from './shared/pipe/pipes.module';
import { TabsModule } from './tabs/tabs.module';
import { TabsService } from './tabs/shared/service/tabs.service';


export function createTranslateHttpLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      backButtonText: '返回'
    }),
    AppRoutingModule,
    TabsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateHttpLoader,
        deps: [HttpClient],
      },
    }),
    StoreModule.forRoot({
      userReducer
    }),
    CoreModule,
    PipesModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Store,
    LoginService,
    LocalStorageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    TabsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
