import { createAction, props } from '@ngrx/store';
import { IUserFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';
import { ILoginUser, IRegisterUser } from 'src/shared/interfaces/user.interface';
import firebase from 'firebase/app';

export const CHECK_AUTH = createAction('[USER] Check Auth');
export const CHECK_AUTH_SUCCESS = createAction(
  '[USER] Check Auth Success',
  props<{ isLogged: boolean; user: IUserFirebaseCollection }>()
);
export const CHECK_AUTH_ERROR = createAction('[USER] Check Auth Error', props<{ payload: Error }>());

export const LOGIN_USER = createAction('[USER] Login User', props<{ payload: ILoginUser }>());
export const LOGIN_USER_SUCCESS = createAction(
  '[USER] Login User Success',
  props<{ payload: IUserFirebaseCollection }>()
);
export const LOGIN_USER_ERROR = createAction('[USER] Login User Error', props<{ payload: Error }>());

export const LOGOUT_USER = createAction('[USER] Logout User');
export const LOGOUT_USER_SUCCESS = createAction('[USER] Logout User Success');
export const LOGOUT_USER_ERROR = createAction('[USER] Logout User Error', props<{ payload: Error }>());

export const REGISTER_USER = createAction('[USER] Register User', props<{ payload: IRegisterUser }>());
export const REGISTER_USER_SUCCESS = createAction('[USER] Register User Success');
export const REGISTER_USER_ERROR = createAction('[USER] Register User Error', props<{ payload: Error }>());

export const CREATE_USER = createAction('[USER] Create User', props<{ email:string,uid:string }>());
export const CREATE_USER_SUCCESS = createAction('[USER] Create User Success');
export const CREATE_USER_ERROR = createAction('[USER] Create User Error', props<{ payload: Error }>());

export const GET_ALL_USERS = createAction('[USER] Get All Users');
export const GET_ALL_USERS_SUCCESS = createAction(
  '[USER] Get All Users Success',
  props<{ payload: IUserFirebaseCollection[] }>()
);
export const GET_ALL_USERS_ERROR = createAction('[USER] Get All Users Error', props<{ payload: Error }>());

export const GET_USER = createAction('[USER] Get User', props<{ payload: string }>());
export const GET_USER_SUCCESS = createAction('[USER] Get User Success', props<{ payload: IUserFirebaseCollection }>());
export const GET_USER_ERROR = createAction('[USER] Get User Error', props<{ payload: Error }>());

export const SET_USER_LOGO = createAction('[USER] Set User Logo', props<{ payload: string }>());
export const SET_USER_LOGO_SUCCESS = createAction('[USER] Set User Logo Success', props<{ payload: Blob }>());
export const SET_USER_LOGO_ERROR = createAction('[USER] Set User Logo Error', props<{ payload: Error }>());

export const GET_USER_LOGO = createAction('[USER] Get User Logo', props<{ payload: string }>());
export const GET_USER_LOGO_SUCCESS = createAction('[USER] Get User Logo Success', props<{ payload: Blob }>());
export const GET_USER_LOGO_ERROR = createAction('[USER] Get User Logo Error', props<{ payload: Error }>());

export const MODIFY_USER_DATA = createAction(
  '[USER] Modify User Data',
  props<{ user: IUserFirebaseCollection; id: string }>()
);
export const MODIFY_USER_DATA_SUCCESS = createAction(
  '[USER] Modify User Data Success',
  props<{ payload: IUserFirebaseCollection }>()
);
export const MODIFY_USER_DATA_ERROR = createAction('[USER] Modify User Data Error', props<{ payload: Error }>());
