import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap, pluck } from 'rxjs/operators';
import { IUserFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';
import { ErrorService } from 'src/shared/services/error.service';
import { FirebaseService } from 'src/shared/services/firebase.service';
import {
  GET_USER,
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  REGISTER_USER,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,
} from '../actions/user.action';
import firebase from 'firebase/app';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

@Injectable()
export class UserEffects {
  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGIN_USER),
      switchMap(() => this.fireService.loginByGoogleProvider()),
      switchMap(({ user }) => combineLatest([this.fireService.getUserByEmail(user.email), of(user)])),
      switchMap(([foundUser, user]: [QueryDocumentSnapshot<IUserFirebaseCollection>, firebase.User]) => {
        if (foundUser) {
          return this.errorService.handleResponse(LOGIN_USER_SUCCESS({ payload: null }));
        } else {
          return this.errorService.handleResponse(REGISTER_USER({ payload: user.email }));
        }
      }),
      catchError((error) => {
        return this.errorService.handleResponse(LOGIN_USER_ERROR({ payload: error }));
      })
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
      catchError((error) => {
        return this.errorService.handleResponse(REGISTER_USER_ERROR({ payload: error }));
      })
    )
  );

  constructor(private actions$: Actions, private fireService: FirebaseService, private errorService: ErrorService) {}
}
