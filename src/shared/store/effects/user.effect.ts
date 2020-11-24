import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap, pluck } from 'rxjs/operators';
import { IUserFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';
import { ErrorService } from 'src/shared/services/error.service';
import { FirebaseService } from 'src/shared/services/firebase.service';
import {
  CHECK_AUTH,
  CHECK_AUTH_ERROR,
  CHECK_AUTH_SUCCESS,
  GET_USER,
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_ERROR,
  LOGOUT_USER_SUCCESS,
  REGISTER_USER,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,
} from '../actions/user.action';
import firebase from 'firebase/app';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from 'src/shared/services/user.service';

@Injectable()
export class UserEffects {
  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGIN_USER),
      switchMap(() => this.fireService.loginByGoogleProvider()),
      switchMap(({ user }) => combineLatest([this.fireService.getUserByEmail(user.email), of(user)])),
      switchMap(([foundUser, user]: [QueryDocumentSnapshot<IUserFirebaseCollection>, firebase.User]) => {
        if (foundUser) {
          return this.errorService.handleResponse(LOGIN_USER_SUCCESS({ payload: foundUser.data() }));
        } else {
          return this.errorService.handleResponse(REGISTER_USER({ payload: user.email }));
        }
      }),
      catchError((error) => this.errorService.handleResponse(LOGIN_USER_ERROR({ payload: error })))
    )
  );

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(REGISTER_USER),
      pluck('payload'),
      switchMap((email) => combineLatest([this.fireService.registerUser(email), of(email)])),
      switchMap(([obs, email]) => {
        const user: IUserFirebaseCollection = {
          address: null,
          email,
          firstName: null,
          id: null,
          interests: null,
          logo: null,
          platform: null,
          surname: null,
          userName: null,
        };

        return this.errorService.handleResponse(LOGIN_USER_SUCCESS({ payload: user }));
      }),
      catchError((error) => this.errorService.handleResponse(REGISTER_USER_ERROR({ payload: error })))
    )
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGOUT_USER),
      switchMap(() => this.fireService.logOut()),
      switchMap(() => this.errorService.handleResponse(LOGOUT_USER_SUCCESS())),
      catchError((error) => this.errorService.handleResponse(LOGOUT_USER_ERROR({ payload: error })))
    )
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CHECK_AUTH),
      switchMap(() => this.fireService.isLoggedIn$),
      switchMap((data) => this.errorService.handleResponse(CHECK_AUTH_SUCCESS({ payload: !!data }))),
      catchError((error) => this.errorService.handleResponse(CHECK_AUTH_ERROR({ payload: error })))
    )
  );

  constructor(
    private actions$: Actions,
    private fireService: FirebaseService,
    private errorService: ErrorService,
    private userService: UserService,
    private router: Router
  ) {}
}
