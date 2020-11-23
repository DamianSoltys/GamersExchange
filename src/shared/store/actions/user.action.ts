import { createAction, props } from '@ngrx/store';
import { IUserFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';

export const LOGIN_USER = createAction('[USER] Login User');
export const LOGIN_USER_SUCCESS = createAction(
  '[USER] Login User Success',
  props<{ payload: IUserFirebaseCollection }>()
);
export const LOGIN_USER_ERROR = createAction('[USER] Login User Error', props<{ payload: Error }>());

export const LOGOUT_USER = createAction('[USER] Logout User');
export const LOGOUT_USER_SUCCESS = createAction('[USER] Logout User Success');
export const LOGOUT_USER_ERROR = createAction('[USER] Logout User Error', props<{ payload: Error }>());

export const REGISTER_USER = createAction('[USER] Register User', props<{ payload: string }>());
export const REGISTER_USER_SUCCESS = createAction(
  '[USER] Register User Success',
  props<{ payload: IUserFirebaseCollection }>()
);
export const REGISTER_USER_ERROR = createAction('[USER] Register User Error', props<{ payload: Error }>());

export const GET_ALL_USERS = createAction('[USER] Get All Users');
export const GET_ALL_USERS_SUCCESS = createAction(
  '[USER] Get All Users Success',
  props<{ payload: IUserFirebaseCollection[] }>()
);
export const GET_ALL_USERS_ERROR = createAction('[USER] Get All Users Error', props<{ payload: Error }>());

export const GET_USER = createAction('[USER] Get User', props<{ email: string }>());
export const GET_USER_SUCCESS = createAction('[USER] Get User Success', props<{ payload: IUserFirebaseCollection }>());
export const GET_USER_ERROR = createAction('[USER] Get User Error', props<{ payload: Error }>());

export const MODIFY_USER_DATA = createAction('[USER] Get All Users', props<{ payload: IUserFirebaseCollection }>());
export const MODIFY_USER_DATA_SUCCESS = createAction(
  '[USER] Get All Users Success',
  props<{ payload: IUserFirebaseCollection }>()
);
export const MODIFY_USER_DATA_ERROR = createAction('[USER] Get All Users Error', props<{ payload: Error }>());
