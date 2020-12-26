import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { AccountTypeEnum, IUserFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';
import { MainService } from 'src/shared/services/main.service';
import { LOGOUT_USER, LOGOUT_USER_SUCCESS } from 'src/shared/store/actions/user.action';
import { IInitialState, IUserState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  // public productsRoute = true;
  private isLoggedIn$ = this.store.select('userState').pipe(map((state: IUserState) => state.isLoggedIn));

  constructor(
    private store: Store<IInitialState>,
    private mainService: MainService,
    private actions$: Actions,
    private router:Router,
    private navigation: NavController
  ) {
    this.actions$.pipe(ofType(LOGOUT_USER_SUCCESS)).subscribe((data) => {
      location.reload();
    });

    // this.router.events.subscribe((val) => {
    //   if(val instanceof NavigationEnd) {
    //     this.productsRoute = val.url.includes('/product/products');
    //   }
    // });
  }

  ngOnInit() {}

  public logOut() {
    this.mainService.dispatch(LOGOUT_USER());
  }
}
