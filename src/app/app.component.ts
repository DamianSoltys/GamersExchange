import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IInitialState, IUserState } from 'src/shared/store/interfaces/store.interface';
import { Store } from '@ngrx/store';
import { CHECK_AUTH } from 'src/shared/store/actions/user.action';
import { distinctUntilChanged, filter, map, skip } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private userState$ = this.store.select('userState').pipe(distinctUntilChanged(state=>state.isLoggedIn),map((state: IUserState) => state.isLoggedIn));

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private store: Store<IInitialState>,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.userState$.pipe(skip(1)).subscribe((isLoggedIn) => {
      isLoggedIn ? this.router.navigate(['/home']) : this.router.navigate(['/guest']);
    });

    this.store.dispatch(CHECK_AUTH());

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
