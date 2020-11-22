import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { LoginPageComponent } from './loginPage.component';
import { LoginPageRoutingModule } from './loginPage-routing.module';

@NgModule({
  declarations: [LoginPageComponent],
  entryComponents: [],
  imports: [LoginPageRoutingModule, IonicModule],
  providers: [StatusBar, SplashScreen, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class LoginPageModule {}
