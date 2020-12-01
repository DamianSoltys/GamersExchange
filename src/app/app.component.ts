import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IInitialState, IUserState } from 'src/shared/store/interfaces/store.interface';
import { Store } from '@ngrx/store';
import { CHECK_AUTH } from 'src/shared/store/actions/user.action';
import { distinctUntilChanged, filter, map, skip } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MainService } from 'src/shared/services/main.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private userState$ = this.store.select('userState').pipe(
    distinctUntilChanged((state) => state.isLoggedIn),
    map((state: IUserState) => state.isLoggedIn)
  );

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private store: Store<IInitialState>,
    private mainService: MainService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.mainService.dispatch(CHECK_AUTH());
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
