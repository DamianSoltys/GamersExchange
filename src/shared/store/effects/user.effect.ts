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
  CREATE_USER,
  CREATE_USER_ERROR,
  CREATE_USER_SUCCESS,
  GET_USER,
  GET_USER_ERROR,
  GET_USER_SUCCESS,
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_ERROR,
  LOGOUT_USER_SUCCESS,
  MODIFY_USER_DATA,
  MODIFY_USER_DATA_ERROR,
  MODIFY_USER_DATA_SUCCESS,
  REGISTER_USER,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,
} from '../actions/user.action';
import firebase from 'firebase/app';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from 'src/shared/services/user.service';
import { ToastMessageEnum, ToastTypeEnum } from 'src/shared/interfaces/toast.interface';
import { Store } from '@ngrx/store';
import { IInitialState } from '../interfaces/store.interface';
import { NavController } from '@ionic/angular';

@Injectable()
export class UserEffects {
  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGIN_USER),
      switchMap(({ payload }) => this.fireService.loginUserByCridentials(payload)),
      switchMap(({ user: { email } }) => this.fireService.getUserByEmail(email)),
      switchMap(({ email, id }) => this.errorService.handleResponse(LOGIN_USER_SUCCESS({ email, id }), true, {
        type: ToastTypeEnum.SUCCESS,
        message: ToastMessageEnum.LOGIN_SUCCESS,
      })),
      catchError((error) =>
        this.errorService.handleResponse(LOGIN_USER_ERROR({ payload: error }), true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.LOGIN_ERROR,
        })
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_USER),
      switchMap(({ payload }) => this.fireService.createUser(payload)),
      switchMap(() =>
        this.errorService.handleResponse(CREATE_USER_SUCCESS(), true, {
          type: ToastTypeEnum.SUCCESS,
          message: ToastMessageEnum.REGISTER_SUCCESS,
        })
      ),
      catchError((error) =>
        this.errorService.handleResponse(CREATE_USER_ERROR({ payload: error }), true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.REGISTER_ERROR,
        })
      )
    )
  );

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(REGISTER_USER),
      switchMap(({ payload }) => combineLatest([this.fireService.registerUserByCridentials(payload), of(payload)])),
      switchMap(([res, payload]) => {
        this.store.dispatch(CREATE_USER({ payload }));

        return this.errorService.handleResponse(REGISTER_USER_SUCCESS());
      }),
      catchError((error) =>
        this.errorService.handleResponse(REGISTER_USER_ERROR({ payload: error }), true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.REGISTER_ERROR,
        })
      )
    )
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGOUT_USER),
      switchMap(() => this.fireService.logOut()),
      switchMap(() => {
        this.navigation.navigateRoot(['/login']);

        return this.errorService.handleResponse(LOGOUT_USER_SUCCESS(), true, {
          type: ToastTypeEnum.SUCCESS,
          message: ToastMessageEnum.LOGOUT_SUCCESS,
        });
      }),
      catchError((error) =>
        this.errorService.handleResponse(LOGOUT_USER_ERROR({ payload: error }), true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.LOGOUT_ERROR,
        })
      )
    )
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CHECK_AUTH),
      switchMap(() => this.fireService.isLoggedIn$),
      switchMap(({ email }) => email ? this.fireService.getUserByEmail(email) : of({ email: null, id: null })),
      switchMap(({ email, id }) => this.errorService.handleResponse(CHECK_AUTH_SUCCESS({ isLogged: !!email, email, id }))),
      catchError((error) => this.errorService.handleResponse(CHECK_AUTH_ERROR({ payload: error })))
    )
  );

  changeUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MODIFY_USER_DATA),
      switchMap(({ user, id }) => combineLatest([this.fireService.modifyUserData(user, id), of(user)])),
      switchMap(([res, data]) =>
        this.errorService.handleResponse(MODIFY_USER_DATA_SUCCESS({ payload: data }), true, {
          type: ToastTypeEnum.SUCCESS,
          message: ToastMessageEnum.MODIFY_USER_SUCCESS,
        })
      ),
      catchError((error) =>
        this.errorService.handleResponse(MODIFY_USER_DATA_ERROR({ payload: error }), true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.MODIFY_USER_ERROR,
        })
      )
    )
  );

  getUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_USER),
      switchMap(({ payload }) => this.fireService.getUserByEmail(payload)),
      switchMap((data: IUserFirebaseCollection) => {
        console.log(data)
        return this.errorService.handleResponse(GET_USER_SUCCESS({ payload: data }));
      }
      ),
      catchError((error) => {

        console.log(error)
        return this.errorService.handleResponse(GET_USER_ERROR({ payload: error }), true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        })
      }
      )
    )
  );

  constructor(
    private actions$: Actions,
    private fireService: FirebaseService,
    private errorService: ErrorService,
    private navigation: NavController,
    private router: Router,
    private store: Store<IInitialState>
  ) { }
}
