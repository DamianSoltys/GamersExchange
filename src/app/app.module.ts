import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { storeConfig, storeEffects } from 'src/shared/store/interfaces/store.interface';
import { EffectsModule } from '@ngrx/effects';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFireStorageModule,
} from "@angular/fire/storage";
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { IonicStorageModule } from '@ionic/storage';
import { LoginComponent } from 'src/shared/components/login/login.component';
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { FooterComponent } from 'src/shared/components/footer/footer.component';
import { AuthGuardService, GuestGuardService } from 'src/shared/guards/authGuard.service';
import { MenuComponent } from 'src/shared/components/menu/menu.component';
import { ToastComponent } from 'src/shared/components/toast/toast.component';
import { RegisterComponent } from 'src/shared/components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    ToastComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    IonicModule.forRoot({
      mode: 'md',
    }),
    AppRoutingModule,
    StoreModule.forRoot(storeConfig),
    EffectsModule.forRoot(storeEffects),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    IonicStorageModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthGuardService,
    GuestGuardService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
