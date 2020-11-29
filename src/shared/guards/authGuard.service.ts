import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, skip, take, takeWhile } from 'rxjs/operators';
import { IInitialState, IUserState } from '../store/interfaces/store.interface';

@Injectable()
export class AuthGuardService implements CanActivate {
  private userState$ = this.store.select('userState').pipe(
    map((state: IUserState) => state.isLoggedIn),
    filter((data) => data !== null)
  );

  constructor(public router: Router, private store: Store<IInitialState>) {}
  canActivate(): Observable<boolean> {
    return this.userState$.pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }

        return isLoggedIn;
      })
    );
  }
}

@Injectable()
export class GuestGuardService implements CanActivate {
  private userState$ = this.store.select('userState').pipe(
    map((state: IUserState) => state.isLoggedIn),
    filter((data) => data !== null)
  );

  constructor(public router: Router, private store: Store<IInitialState>) {}
  canActivate(): Observable<boolean> {
    return this.userState$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/home']);
        }

        return true;
      })
    );
  }
}
